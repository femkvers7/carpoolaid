export type Route = {
  id: string;
  carpoolId: string;
  carSeats: number; // make this obligatory, if not explicitly mentioned, set to 4
  destinationId?: string;
  distance: number;
  duration: number;
  geometry: number[][];
};

// deze moet beter
// const calculateGroups = (overlaps: Overlaps) => {
//   const groups: SuggestionGroup[] = [];

//   while (overlaps && Object.keys(overlaps).length > 0) {
//     const maxOverlap = calculateMaxOverlap(overlaps);

//     if (maxOverlap.value > 20000) {
//       const groupAlreadyExists = groups.find((group) => {
//         if (group.includes(maxOverlap.carpoolId2)) {
//           group.push(maxOverlap.carpoolId1);

//           if (group.length >= 4) {
//             // delete it as an option from all overlaps
//             for (const carpool in overlaps) {
//               for (const assignedRoute of group) {
//                 delete overlaps[carpool][assignedRoute];
//               }
//             }
//           }
//           return true;
//         }
//         return false;
//       });

//       if (!groupAlreadyExists) {
//         groups.push([maxOverlap.carpoolId1]);
//       }

//       delete overlaps[maxOverlap.carpoolId1];
//     }
//   }

//   return groups;
// };
