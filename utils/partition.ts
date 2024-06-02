export function partition<T>(
  array: T[],
  isValid: (elem: T) => boolean,
): [T[], T[]] {
  return array.reduce<[T[], T[]]>(
    ([pass, fail], elem) => {
      return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    },
    [[], []],
  );
}
