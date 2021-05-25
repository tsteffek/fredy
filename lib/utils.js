function isOneOf(word, arr) {
  if (arr == null || arr.length === 0) {
    return false;
  }
  const expression = String.raw`\b(${arr.join('|')})\b`;
  const blacklist = new RegExp(expression, 'ig');

  return blacklist.test(word);
}

function isDuringWorkingHours(job) {
  if (!job.workingHours || job.workingHours.length === 0) return true;

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  return job.workingHours.some(({ begin, end }) => {
    if (currentHour === begin[0]) return begin[1] < currentMinute;
    else if (currentHour === end[0]) return currentMinute < end[1];
    else return begin[0] < currentHour && currentHour < end[0];
  });
}

module.exports = { isOneOf, isDuringWorkingHours };
