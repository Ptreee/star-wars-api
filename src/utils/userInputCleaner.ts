export function listNameCleaner(listName: string) {
  return listName.replace(/[^A-Za-z0-9]/g, '_').trim();
}

export function movieIdCleaner(str: string) {
  const numArr = str.split(',').map(Number).sort();
  const result = [
    ...new Set(
      numArr.filter((x: any) => {
        return typeof x === 'number' && x < 7 && x > 0;
      }),
    ),
  ];
  return result;
}
