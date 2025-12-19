import { MOCK_DATA } from "../mock/opening";
import type { JobOpening } from "../types";

export const fetchJobs = async (): Promise<JobOpening[]> => {
  return MOCK_DATA.items;
};

export const fetchJobDetail = async (
  id: string,
): Promise<JobOpening | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const originalId = id.length > 4 ? id.substring(id.length - 4) : id;
      resolve(
        MOCK_DATA.items.find(
          (item) => item.openingId.toString() === originalId,
        ),
      );
    }, 400);
  });
};
