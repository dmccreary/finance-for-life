from PIL import Image, ImageOps
import sys
import os

# Define target dimensions for 1.91:1 ratio (e.g., 1200x630)
TARGET_WIDTH = 1200
TARGET_HEIGHT = 630

def resize_and_pad_image(input_path, output_path, target_width=TARGET_WIDTH, target_height=TARGET_HEIGHT, background_color=(255, 255, 255)):
    """
    Resize and add padding to an image to fit a 1.91:1 aspect ratio.
    
    Args:
        input_path (str): Path to the input image.
        output_path (str): Path to save the output image.
        target_width (int): Width of the final image (default 1200).
        target_height (int): Height of the final image (default 630).
        background_color (tuple): RGB color for the padding (default white).
    """
    # Open the original image
    image = Image.open(input_path)
    
    # Calculate the original aspect ratio
    original_width, original_height = image.size
    original_ratio = original_width / original_height
    target_ratio = target_width / target_height

    # Determine new dimensions while maintaining the original aspect ratio
    if original_ratio > target_ratio:
        # Image is wider than the target aspect ratio
        new_width = target_width
        new_height = int(target_width / original_ratio)
    else:
        # Image is taller than the target aspect ratio
        new_height = target_height
        new_width = int(target_height * original_ratio)

    # Resize the image
    resized_image = image.resize((new_width, new_height), Image.LANCZOS)

    # Create a new blank canvas with target dimensions and background color
    new_image = Image.new("RGB", (target_width, target_height), background_color)

    # Calculate position to center the resized image
    x_offset = (target_width - new_width) // 2
    y_offset = (target_height - new_height) // 2

    # Paste the resized image onto the center of the new canvas
    new_image.paste(resized_image, (x_offset, y_offset))

    # Save the final image
    new_image.save(output_path)
    print(f"✅ Image successfully resized and padded. Saved to: {output_path}")


def process_images_in_directory(input_directory, output_directory):
    """
    Process all images in a directory and convert them to 1.91:1 aspect ratio.
    """
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    for filename in os.listdir(input_directory):
        if filename.lower().endswith((".png", ".jpg", ".jpeg")):
            input_path = os.path.join(input_directory, filename)
            output_path = os.path.join(output_directory, filename)
            resize_and_pad_image(input_path, output_path)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python resize_with_padding.py <input_image_or_directory> <output_directory>")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2]

    if os.path.isdir(input_path):
        process_images_in_directory(input_path, output_path)
    else:
        resize_and_pad_image(input_path, output_path)

