import APIs from '../config';

export const fetchTags = async (tag = '') => {
  const url = tag === '' ? `${APIs.tagsAPI}` : `${APIs.tagsAPI}&inname=${tag}`;
  return await fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      return res.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const fetchQuestions = async (question, page) => {
  return await fetch(`${APIs.questionsAPI}&tagged=${question}&page=${page}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      return res.json();
    })
    .catch((err) => {
      console.log(err);
    });
};
