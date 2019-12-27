import React, { useReducer, useCallback, useEffect } from 'react';

interface IconProperty {
  id: string
  img: any 
  name: string
  style: any
  left: number
  top: number
  onDoubleClick: any
}

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'drag_start':
      return {
        ...state,
        x: action.x,
        y: action.y,
        selected: true,
      }
    case 'drag_dialog':
      if (!state.selected) return state;

      return {
        ...state,
        x: action.x,
        y: action.y,
        top: state.top + action.y - state.y,
        left: state.left + action.x - state.x,
      }
    case 'mouseup':
      if (!state.selected) return state;
      
      return {
        ...state,
        selected: false,
      }
    default: 
      console.log(action)
      throw new Error()
  }
}

const Icon: React.FC<IconProperty> = ({ style, id, name, top, left, img, onDoubleClick }) => {
  const [state, dispatch] = useReducer(reducer, {
    mouse: { x: 0, y: 0 },
    top,
    left,
    selected: false,
  })

  useEffect(() => {
    const onmousemove = (e: MouseEvent) => {
      e.preventDefault();
      dispatch({
        type: 'drag_dialog',
        x: e.clientX,
        y: e.clientY,
      })
    }
    document.addEventListener('mousemove', onmousemove)
    return () => {
      document.removeEventListener('mousemove', onmousemove)
    }
  }, [])
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({type: 'drag_start', x: e.clientX, y: e.clientY})
  }, [])
  const onMouseUp = useCallback((e: React.MouseEvent) => {
    dispatch({type: 'mouseup'})
  }, [])

  return (
    <div id={id} 
      style={{...style, left: state.left, top: state.top}}
      className={'app-icon ' + id + (state.selected ? ' app-icon-clicked' : '')}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onDoubleClick={onDoubleClick}>
      <div className="relative">
        <img data-icon-id={id} src={img} />
        <span className="app-icon-name">{name}</span>
      </div>
    </div>
  );
}

export default Icon;