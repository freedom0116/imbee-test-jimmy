import { useEffect, useState, useCallback } from 'react';
import Question from './components/Question';
import Tag from './components/Tag';
import APIs from './config';
import _ from 'lodash';
import mockQuestions from './mock/questions';
import mockTags from './mock/tags';
import useScrollPosition from './hooks/useScrollPosition';
import SearchBar from './components/SearchBar';
import Spinner from './components/Spinner';

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
  const [isLoading, setIsLoading] = useState(false);
  const scrollPosition = useScrollPosition();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchTags().then((apiTags) => {
        setTags(apiTags.items);
        setCurrentTag(apiTags.items[0].name);
      });
      await fetchQuestions(currentTag).then((apiQuestions) => {
        setQuestions(apiQuestions.items);
      });
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // use mock data
  // useEffect(() => {
  //   setTags(mockTags.items);
  //   setCurrentTag(mockTags.items[0].name);
  //   setQuestions(mockQuestions.items);
  // }, []);

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

  const clickTag = async (tag) => {
    setIsLoading(true);
    setCurrentTag(tag);
    setQuestions([]);
    await fetchQuestions(tag).then((apiQuestions) => {
      setQuestions(apiQuestions.items);
    });
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className={`${scrollPosition > 36 ? 'fixed w-full' : 'relative'}`}>
        <SearchBar value={search} onChange={searchTag}></SearchBar>
      </div>

      <div className="text-left">
        <h3 className="text-2xl">Trending</h3>
      </div>
      <div>
        {tags.map(({ name }) => (
          <Tag
            key={name}
            name={name}
            onChange={clickTag}
            currentTag={currentTag}
          ></Tag>
        ))}
      </div>
      <div>
        {questions.map((question) => (
          <Question key={question.question_id} question={question} />
        ))}
      </div>
      {isLoading && (
        <div class="flex justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default App;
