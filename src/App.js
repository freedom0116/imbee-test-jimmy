import { useEffect, useState, useCallback } from 'react';
import Question from './components/Question';
import Tag from './components/Tag';
import _ from 'lodash';
import useScrollPosition from './hooks/useScrollPosition';
import SearchBar from './components/SearchBar';
import Spinner from './components/Spinner';
import { fetchTags, fetchQuestions } from './api';

import mockQuestions from './mock/questions';
import mockTags from './mock/tags';

function App() {
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const scrollPosition = useScrollPosition();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     await fetchTags().then((apiTags) => {
  //       setTags(apiTags.items);
  //       if (apiTags.items && apiTags.items.length > 0)
  //         setCurrentTag(apiTags.items[0].name);
  //     });
  //     await fetchQuestions(currentTag, 1).then((apiQuestions) => {
  //       setQuestions(apiQuestions.items);
  //     });
  //     setIsLoading(false);
  //     setPage(1);
  //   };

  //   fetchData();
  // }, []);

  // use mock data
  useEffect(() => {
    setTags(mockTags.items);
    setCurrentTag(mockTags.items[0].name);
    setQuestions(mockQuestions.items);
    setPage(1);
  }, []);

  useEffect(() => {
    const fetchNextPage = async () => {
      if (
        scrollPosition + window.screen.height >= document.body.scrollHeight &&
        !isLoading &&
        page > 0
      ) {
        setIsLoading(true);
        setPage(page + 1);
        await fetchQuestions(currentTag, page + 1).then((apiQuestions) => {
          setQuestions(questions.concat(apiQuestions.items));
        });
        setIsLoading(false);
      }
    };

    fetchNextPage();
  }, [scrollPosition]);

  const debounceSearch = useCallback(
    _.debounce(async (search) => {
      await fetchTags(search).then((apiTags) => {
        setTags(apiTags.items);
        if (apiTags.items && apiTags.items.length > 0)
          setCurrentTag(apiTags.items[0].name);
      });
      setPage(1);
      await fetchQuestions(currentTag, 1).then((apiQuestions) => {
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
    setPage(1);
    await fetchQuestions(tag, 1).then((apiQuestions) => {
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
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default App;
