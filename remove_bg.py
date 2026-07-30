import os
import sys
import subprocess

def install_and_import(package):
    try:
        __import__(package)
    except ImportError:
        print(f"Installing {package}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])

def main():
    # Install required packages
    install_and_import("rembg")
    install_and_import("PIL") # pillow

    from rembg import remove
    from PIL import Image

    input_path = "assets/original_subject.jpg"
    output_path = "assets/subject.png"

    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found.")
        return

    print("Removing background from image. This might take a moment as it downloads the model...")
    try:
        input_image = Image.open(input_path)
        output_image = remove(input_image)
        output_image.save(output_path)
        print(f"Success! Background removed and saved to {output_path}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
