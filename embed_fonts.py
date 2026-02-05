
import base64
import os

# Mapping of current CSS rules to files
fonts = [
    {
        'family': 'Manrope',
        'style': 'normal',
        'weight': '400',
        'file': 'Manrope-Regular.ttf'
    },
    {
        'family': 'Manrope',
        'style': 'normal',
        'weight': '500',
        'file': 'Manrope-Medium.ttf'
    },
    {
        'family': 'Manrope',
        'style': 'normal',
        'weight': '700',
        'file': 'Manrope-Bold.ttf'
    },
    {
        'family': 'Manrope',
        'style': 'normal',
        'weight': '800',
        'file': 'Manrope-ExtraBold.ttf'
    },
    {
        'family': 'JetBrains Mono',
        'style': 'normal',
        'weight': '400',
        'file': 'JetBrainsMono-Regular.ttf'
    },
    {
        'family': 'JetBrains Mono',
        'style': 'normal',
        'weight': '700',
        'file': 'JetBrainsMono-Bold.ttf'
    }
]

base_dir = r"c:\Users\VLAD\Documents\GitHub\fencing\css\fonts"
output_css = []

print("Starting font embedding...")

for font in fonts:
    file_path = os.path.join(base_dir, font['file'])
    print(f"Processing {font['file']}...")
    try:
        with open(file_path, "rb") as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
            
        css_rule = f"""@font-face {{
  font-family: '{font['family']}';
  font-style: {font['style']};
  font-weight: {font['weight']};
  font-display: swap;
  src: url('data:font/ttf;charset=utf-8;base64,{encoded}') format('truetype');
}}"""
        output_css.append(css_rule)
    except Exception as e:
        print(f"Error processing {font['file']}: {e}")

final_css_content = "\n".join(output_css)

output_file = r"c:\Users\VLAD\Documents\GitHub\fencing\css\fonts_embedded.css"
with open(output_file, "w", encoding="utf-8") as f:
    f.write(final_css_content)

print(f"Successfully created {output_file}")
