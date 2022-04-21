import { useEffect, useState } from 'react';
import Tag from './components/Tag';
import APIs from './config';

const fetchTags = () => {
  return fetch(APIs.tagsAPI, { method: 'GET', mode: 'cors' })
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

  useEffect(() => {
    fetchTags().then((apiTags) => {
      setTags(apiTags.items);
      setCurrentTag(apiTags.items[0].name);
      console.log(apiTags.items);
    });
  }, []);

  return (
    <div className="flex flex-col items-center">
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
      <div>{currentTag}</div>
    </div>
  );
}

export default App;
