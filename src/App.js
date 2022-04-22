import { useEffect, useState, useCallback } from 'react';
import Question from './components/Question';
import Tag from './components/Tag';
import _ from 'lodash';
import useScrollPosition from './hooks/useScrollPosition';
import SearchBar from './components/SearchBar';
import Spinner from './components/Spinner';
import { fetchTags, fetchQuestions } from './api';

import { useSelector, useDispatch } from 'react-redux';
import { setTags } from './store/tag';
import { setQuestions, addQuestions } from './store/question';

function App() {
  const [currentTag, setCurrentTag] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const scrollPosition = useScrollPosition();

  const tags = useSelector((state) => state.tag.value);
  const questions = useSelector((state) => state.question.value);
  const dispatch = useDispatch();

  // fetching data initially
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const tags = await fetchTags().then((apiTags) => {
        dispatch(setTags(apiTags.items));
        return apiTags.items;
      });

      if (tags && tags.length > 0) {
        const firstTag = tags[0].name;
        setCurrentTag(firstTag);

        await fetchQuestions(firstTag, 1).then((apiQuestions) => {
          dispatch(setQuestions(apiQuestions.items));
        });
      }
      setIsLoading(false);
      setPage(1);
    };

    fetchData();
  }, []);

  // fetching data of next page
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
          dispatch(addQuestions(apiQuestions.items));
        });
        setIsLoading(false);
      }
    };

    fetchNextPage();
  }, [scrollPosition]);

  const debounceSearch = useCallback(
    _.debounce(async (search) => {
      setIsLoading(true);
      const tags = await fetchTags(search).then((apiTags) => {
        dispatch(setTags(apiTags.items));
        return apiTags.items;
      });

      dispatch(setQuestions([]));
      if (tags && tags.length > 0) {
        const firstTag = tags[0].name;
        setCurrentTag(firstTag);

        await fetchQuestions(firstTag, 1).then((apiQuestions) => {
          dispatch(setQuestions(apiQuestions.items));
        });
      }

      setIsLoading(false);
      setPage(1);
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
    dispatch(setQuestions([]));
    setPage(1);
    await fetchQuestions(tag, 1).then((apiQuestions) => {
      dispatch(setQuestions(apiQuestions.items));
    });
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <SearchBar value={search} onChange={searchTag}></SearchBar>

      <div className="text-left">
        <h3 className="text-2xl">Trending</h3>
      </div>
      <div
        className={`${scrollPosition > 80 ? 'fixed w-full top-2' : 'relative'}`}
      >
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
