import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

const Markdown: React.FC = ({ }) => {
  const [input, setInput] = useState('');
  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }, [])
  return (
    <div className="markdown-block">
      <div style={{width: "50%", height: "100%", float: "left"}}>
        <textarea style={{fontSize: "1em", width: "90%", height: "100%"}} value={input} onChange={onChange} />
      </div>
      <div style={{width: "50%", float: "left"}}>
        <ReactMarkdown source={input}/>
      </div>
    </div>
  );
}

export default Markdown;