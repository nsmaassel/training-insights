const FIT_MAGIC = '.FIT';

export const validateFitFile = async (file: File): Promise<boolean> => {
  // Check extension
  if (!file.name.toLowerCase().endsWith('.fit')) {
    return false;
  }

  try {
    // Read first 14 bytes to check header
    const buffer = await file.slice(0, 14).arrayBuffer();
    const view = new Uint8Array(buffer);
    
    // Check for .FIT magic bytes at position 8
    const magic = new TextDecoder().decode(view.slice(8, 12));
    return magic === FIT_MAGIC;
  } catch {
    return false;
  }
};