// Generate avatar URL based on name
export const generateAvatarUrl = (name: string) => {
    if (!name) return "";    
    return `https://ui-avatars.com/api/?name=${name}&background=random&size=64&bold=true`;
};


// Extract initials for avatar display
export const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };