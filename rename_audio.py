#!/usr/bin/env python3
import os
import re

audio_dir = 'public/audio/math-adventures'

# Define the replacements
replacements = {
    ''': '',  # Right single quotation mark
    ''': '',  # Left single quotation mark
    '—': '-',  # Em dash
    '⚡': 'lightning',  # Lightning bolt
    '!': '',  # Exclamation mark
    ',': '',  # Comma
    '.': '',  # Period (except before .mp3)
}

def clean_filename(filename):
    """Clean filename by removing special characters"""
    if not filename.endswith('.mp3'):
        return filename

    # Get name without extension
    name = filename[:-4]

    # Apply replacements
    for old, new in replacements.items():
        name = name.replace(old, new)

    # Remove extra spaces
    name = re.sub(r'\s+', ' ', name).strip()

    # Add extension back
    return name + '.mp3'

# Rename files
for filename in os.listdir(audio_dir):
    if filename.endswith('.mp3'):
        new_filename = clean_filename(filename)
        if filename != new_filename:
            old_path = os.path.join(audio_dir, filename)
            new_path = os.path.join(audio_dir, new_filename)
            try:
                os.rename(old_path, new_path)
                print(f'Renamed: {filename} -> {new_filename}')
            except Exception as e:
                print(f'Error renaming {filename}: {e}')

print('\nAll files renamed!')
