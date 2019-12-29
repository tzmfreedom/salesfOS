import React, { useReducer, useCallback, useRef } from 'react';
import Command from './Command';

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'set_current':
      return {
        ...state,
        current: action.value,
      }
    case 'execute_command':
      const histories = state.histories;
      histories.push({
        command: state.current,
        result: action.result,
        cwd: state.cwd,
      })
      return {
        ...state,
        histories,
        current: '',
        cwd: action.cwd,
      }
    default:
      console.log(action);
      throw new Error();
  }
}

const executeCommand = (result: string, cwd: string) => {
  return {type: 'execute_command', result, cwd}
}
const setCurrent = (value: string) => {
  return {type: 'set_current', value}
}
const Console: React.FC = ({ }) => {
  const [state, dispatch] = useReducer(reducer, {
    histories: [] as any[],
    current: '',
    cwd: '/home/hoge/',
  })
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCurrent(e.target.value))
  }, []);
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      const res = new Command().execute(state.current, {result: '', cwd: state.cwd})
      console.log(res);
      dispatch(executeCommand(res.result, res.cwd))
    }
  }, [state.current, state.cwd]);
  const ref = useRef<HTMLInputElement>(null)
  const focus = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    ref.current!.focus()
  }, [])
  return (
    <div className="console-block" onClick={focus}>
      {state.histories.map((h: any, index: number)=> {
        return (
          <div key={index}>
            {h.cwd} $ {h.command}<br/>
            {h.result}
          </div>
        )
      })}
      <div>
        {state.cwd} $ <input type="text" ref={ref} onChange={onChange} onKeyDown={onKeyDown} value={state.current}/>
      </div>
    </div>
  );
}

export default Console;