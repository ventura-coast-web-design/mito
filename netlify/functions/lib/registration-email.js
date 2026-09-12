const nodemailer = require("nodemailer");

const cities = require("../../../src/_data/cities.json");
const templates = require("./email-templates");
const REGISTRATION_FORM_PREFIX = "local-contact-";

function getSessionSchedule(session) {
  if (!session) {
    return { seminarDate: "", seminarTime: "" };
  }

  if (session.date || session.time) {
    return {
      seminarDate: session.date || "",
      seminarTime: session.time || "",
    };
  }

  const when = session.when;
  if (!when) {
    return { seminarDate: "", seminarTime: "" };
  }

  const commaIndex = when.indexOf(",");
  if (commaIndex === -1) {
    return { seminarTime: when.trim(), seminarDate: "" };
  }

  return {
    seminarTime: when.slice(0, commaIndex).trim(),
    seminarDate: when.slice(commaIndex + 1).trim(),
  };
}

function findCity(citySlug) {
  return cities.find((city) => city.slug === citySlug);
}

function formatLocation(city) {
  if (!city) {
    return "";
  }

  return city.region ? `${city.city}, ${city.region}` : city.city;
}

function formatVenueAddress(city) {
  if (!city?.addressLines?.length) {
    return "";
  }

  return city.addressLines.join(", ");
}

function buildZoomSections(city) {
  const url = city?.zoom?.url;
  if (!url) {
    return { ZoomSectionHtml: "", ZoomSectionText: "\n" };
  }

  const label = city.zoom.linkLabel || "Unirse por Zoom";

  return {
    ZoomSectionHtml: `
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#faf8f5;border:1px solid #ece7df;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#d32f2f;">
                      Disponible por Zoom
                    </p>
                    <p style="margin:0 0 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#3d3d3d;">
                      Si no puedes asistir en persona, únete en línea con este enlace:
                    </p>
                    <p style="margin:0;">
                      <a href="${url}" style="display:inline-block;background-color:#d32f2f;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;font-weight:600;text-decoration:none;padding:12px 20px;border-radius:6px;">
                        ${label}
                      </a>
                    </p>
                    <p style="margin:12px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.5;color:#6b6b6b;word-break:break-all;">
                      ${url}
                    </p>
                  </td>
                </tr>
              </table>`,
    ZoomSectionText: `
Disponible por Zoom

Si no puedes asistir en persona, únete en línea con este enlace:
${url}
`,
  };
}

function renderTemplate(template, values) {
  return Object.entries(values).reduce((result, [key, value]) => {
    const pattern = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    return result.replace(pattern, value ?? "");
  }, template);
}

function buildRegistrationEmailValues(formData) {
  const city = findCity(formData["city-slug"]);
  const session = city?.sessions?.[0];
  const { seminarDate, seminarTime } = getSessionSchedule(session);
  const zoomSections = buildZoomSections(city);

  return {
    FirstName: formData["first-name"] || "",
    LastName: formData["last-name"] || "",
    Location: formData["city-label"] || formatLocation(city),
    SeminarDate: seminarDate,
    SeminarTime: seminarTime,
    VenueName: city?.venueName || "",
    VenueAddress: formatVenueAddress(city),
    AttendeeCount: formData["how-many"] || "1",
    ...zoomSections,
  };
}

function createTransport() {
  const host = process.env.SMTP_HOST || "mail.privateemail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE !== "false";

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function isRegistrationForm(formName) {
  return typeof formName === "string" && formName.startsWith(REGISTRATION_FORM_PREFIX);
}

async function sendRegistrationEmail(formData) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP_USER and SMTP_PASS must be configured.");
  }

  const recipient = formData.email;
  if (!recipient) {
    throw new Error("Registration submission is missing an email address.");
  }

  const values = buildRegistrationEmailValues(formData);
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const transport = createTransport();

  await transport.sendMail({
    from,
    to: recipient,
    replyTo: process.env.SMTP_REPLY_TO || from,
    subject: "Registro confirmado: El mito de Satanás",
    html: renderTemplate(templates.html, values),
    text: renderTemplate(templates.text, values),
  });
}

module.exports = {
  isRegistrationForm,
  sendRegistrationEmail,
};
