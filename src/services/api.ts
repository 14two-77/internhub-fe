import { MOCK_DATA_SENIOR, MOCK_DATA_JUNIOR } from "../mock/opening";
import type { JobOpening } from "../types";
import { useDatasetStore } from "../stores/datasetStore";

/**
 * Helper returning the mock dataset according to store current value.
 * We call the store getter directly so this works outside React components.
 */
function getCurrentMock() {
  const datasetId = useDatasetStore.getState().current;
  switch (datasetId) {
    case "junior":
      return MOCK_DATA_JUNIOR;
    case "senior":
    default:
      return MOCK_DATA_SENIOR;
  }
}

export const fetchJobs = async (): Promise<JobOpening[]> => {
  const ds = getCurrentMock();
  // keep the same API shape as before
  return ds.items;
};

export const fetchJobDetail = async (
  id: string
): Promise<JobOpening | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const originalId = id.length > 4 ? id.substring(id.length - 4) : id;
      const ds = getCurrentMock();
      resolve(
        ds.items.find((item) => item.openingId.toString() === originalId)
      );
    }, 400);
  });
};
