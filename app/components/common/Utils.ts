export function initialsName(name: string) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("");
  }