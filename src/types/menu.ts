export interface MenuItem {
  id: number;
  name: string;
  parentid: number | null;
  mainMenu: string;
  levelNo: number;
  children?: MenuItem[];
}

/**
 * Utility to generate the dynamic filter URL based on level
 * Level 1: ?mainMenu=...
 * Level 2: ?category=...
 * Level 3: ?type=...
 */
export const getFilterUrl = (item: MenuItem): string => {
  const baseUrl = "/products";
  switch (item.levelNo) {
    case 1:
      return `${baseUrl}?mainMenu=${encodeURIComponent(item.mainMenu)}`;
    case 2:
      return `${baseUrl}?category=${encodeURIComponent(item.name)}`;
    case 3:
      return `${baseUrl}?type=${encodeURIComponent(item.name)}`;
    default:
      return baseUrl;
  }
};