import { useEffect, useState, useCallback } from 'react';
import Question from './components/Question';
import Tag from './components/Tag';
import APIs from './config';
import _ from 'lodash';

const fetchTags = async (tag = '') => {
  const url =
    tag === ''
      ? `${APIs.tagsAPI}&site=stackoverflow`
      : `${APIs.tagsAPI}&inname=${tag}&site=stackoverflow`;
  return await fetch(url)
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

const fetchQuestions = async (question) => {
  return await fetch(
    `${APIs.questionsAPI}&tagged=${question}&site=stackoverflow`
  )
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.log(err);
    });
};

function App() {
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      await fetchTags().then((apiTags) => {
        setTags(apiTags.items);
        setCurrentTag(apiTags.items[0].name);
      });
      await fetchQuestions(currentTag).then((apiQuestions) => {
        setQuestions(apiQuestions.items);
      });
    };

    fetchData();
  }, []);

  const debounceSearch = useCallback(
    _.debounce(async (search) => {
      await fetchTags(search).then((apiTags) => {
        setTags(apiTags.items);
        setCurrentTag(apiTags.items[0].name);
      });
      await fetchQuestions(currentTag).then((apiQuestions) => {
        setQuestions(apiQuestions.items);
      });
    }, 500),
    []
  );

  const searchTag = async (e) => {
    setSearch(e);
    await debounceSearch(e);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-row mt-2 h-8">
        <input
          type="text"
          placeholder="tag"
          value={search}
          onChange={(e) => searchTag(e.target.value)}
          className="w-full border border-blue-300 rounded-l-lg"
        />
        <div className="relative bg-blue-300 px-4 py-1 rounded-r-lg">
          Search
        </div>
      </div>

      <div className="text-left">
        <h3 className="text-2xl">Trending</h3>
      </div>
      <div>
        {tags.map(({ name }) => (
          <Tag
            key={name}
            name={name}
            currentTag={currentTag}
            setCurrentTag={setCurrentTag}
          ></Tag>
        ))}
      </div>
      <div>
        {questions.map((question) => (
          <Question key={question.question_id} question={question} />
        ))}
      </div>
    </div>
  );
}

export default App;
