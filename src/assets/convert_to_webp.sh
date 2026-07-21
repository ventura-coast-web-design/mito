#!/bin/bash

set -e

convert_to_webp() {
    local input="$1"
    local output="$2"

    if command -v magick >/dev/null 2>&1; then
        magick "$input" -quality 85 "$output"
    elif command -v convert >/dev/null 2>&1; then
        convert "$input" -quality 85 "$output"
    elif command -v npx >/dev/null 2>&1; then
        npx --yes sharp-cli -i "$input" -o "$output" -f webp -q 85
    else
        echo "Error: install ImageMagick or Node.js to convert images." >&2
        return 1
    fi
}

# Convert all JPG images to WebP format
echo "Converting images to WebP format..."

# Convert all .jpg files
for file in *.jpg; do
    if [ -f "$file" ]; then
        echo "Converting $file to WebP..."
        convert_to_webp "$file" "${file%.jpg}.webp"
    fi
done

# Convert all .JPG files
for file in *.JPG; do
    if [ -f "$file" ]; then
        echo "Converting $file to WebP..."
        convert_to_webp "$file" "${file%.JPG}.webp"
    fi
done

# Convert all .png files
for file in *.png; do
    if [ -f "$file" ]; then
        echo "Converting $file to WebP..."
        convert_to_webp "$file" "${file%.png}.webp"
    fi
done

# Convert all .PNG files
for file in *.PNG; do
    if [ -f "$file" ]; then
        echo "Converting $file to WebP..."
        convert_to_webp "$file" "${file%.PNG}.webp"
    fi
done

# Convert all .jpeg files
for file in *.jpeg; do
    if [ -f "$file" ]; then
        echo "Converting $file to WebP..."
        convert_to_webp "$file" "${file%.jpeg}.webp"
    fi
done

# Convert all .JPEG files
for file in *.JPEG; do
    if [ -f "$file" ]; then
        echo "Converting $file to WebP..."
        convert_to_webp "$file" "${file%.JPEG}.webp"
    fi
done

echo "Conversion complete! All images have been converted to WebP format."
echo "Original JPG, JPG, PNG, PNG, JPEG, JPEG files are preserved. You can delete them manually if needed." 