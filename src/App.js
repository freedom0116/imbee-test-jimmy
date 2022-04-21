import { useEffect, useState } from 'react';
import Question from './components/Question';
import Tag from './components/Tag';
import APIs from './config';

const fetchTags = async () => {
  return await fetch(APIs.tagsAPI)
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

  return (
    <div className="max-w-2xl mx-auto">
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
