import base64
import os

# Configuration
# Assuming script is run from project root
BASE_DIR = os.path.join(os.getcwd(), 'css', 'fonts')
OUTPUT_FILE = os.path.join(os.getcwd(), 'css', 'fonts_embedded.css')

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

def create_embedded_css():
    print(f"Searching for fonts in: {BASE_DIR}")
    if not os.path.exists(BASE_DIR):
        print(f"Error: Directory {BASE_DIR} not found.")
        return

    output_css = []

    for font in fonts:
        file_path = os.path.join(BASE_DIR, font['file'])
        print(f"Processing {font['file']}...")
        
        if not os.path.exists(file_path):
            print(f"  Warning: File not found: {file_path}")
            continue

        try:
            with open(file_path, "rb") as f:
                encoded = base64.b64encode(f.read()).decode('utf-8')
            
            # Using font-display: optional or swap. 
            # 'swap' is safer for general text, 'block' or 'optional' might be better for hero if we want NO flicker, 
            # but since it's embedded, it should load with CSS. 
            # We keep 'swap' as per original or standard practice, but since it's base64 in CSS, it's effectively immediate once CSS parses.
            css_rule = f"""@font-face {{
  font-family: '{font['family']}';
  font-style: {font['style']};
  font-weight: {font['weight']};
  font-display: swap;
  src: url('data:font/ttf;charset=utf-8;base64,{encoded}') format('truetype');
}}"""
            output_css.append(css_rule)
        except Exception as e:
            print(f"  Error processing {font['file']}: {e}")

    if not output_css:
        print("No fonts were processed. CSS generation aborted.")
        return

    final_css_content = "\n".join(output_css)
    
    try:
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            f.write(final_css_content)
        print(f"Successfully created {OUTPUT_FILE}")
    except Exception as e:
        print(f"Error writing output file: {e}")

if __name__ == "__main__":
    create_embedded_css()
