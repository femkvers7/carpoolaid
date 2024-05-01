// data structure IN:
/** Let's transfer to structured input ;
 * {
 *  "address_line1"?: string,
 *  "street"?: string,
 *  "number"?: string
 *  "place": string,
 *  "country": string
 * }
 */

// data structure OUT:
/** ??
 * {
 *  "destination_coords": {
 *   "id": string,
 *   "coords": [number, number],
 *   "label"?: string, (to show in popup, for example),
 *   "address"?: {
 *    "address_line1"?: string,
 *    "street"?: string,
 *    "number"?: string
 *    "place"?: string,
 *    "country"?: string,
 *    "full_address"?: string
 *   }
 *  },
 *  "carpool_coords": {
 *   "id": string,
 *   "coords": [number, number],
 *   "label"?: string,
 *   "address"?: {
 *    "address_line1"?: string,
 *    "street"?: string,
 *    "number"?: string
 *    "place"?: string,
 *    "country"?: string,
 *    "full_address"?: string
 *   }
 *  }[],
 *  "routes": {
 *   "id": string,
 *   "carpool_id": string,
 *   "destination_id"?: string, --> only of value if multiple destinations are defined, so probs abundant
 *   "geometry": [number, number][]
 *  }[],
 *  "suggestions":{
 *   "id": string,
 *   "carpool_ids": string[],
 *  }
 * }
 */

import { v4 as uuidv4 } from "uuid";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  return body;
});
