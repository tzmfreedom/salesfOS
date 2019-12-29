import React, { useReducer, useCallback, useEffect, CSSProperties } from 'react';

interface IconProperty {
  id: string
  img: any 
  name: string
  style: CSSProperties
  left: number
  top: number
  onDoubleClick: (e: React.MouseEvent) => void
}

interface State {
  x: number
  y: number
  top: number
  left: number
  selected: boolean
  dragging: boolean
}

type Action = (
  | ReturnType<typeof dragStart>
  | ReturnType<typeof drag>
  | ReturnType<typeof mouseup>
)

const dragStart = (x: number, y: number) => {
  return {
    type: 'drag_start' as const,
    x,
    y,
  }
}

const drag = (x: number, y: number) => {
  return {
    type: 'drag' as const,
    x,
    y,
  }
}

const mouseup = () => {
  return {
    type: 'mouseup' as const,
  }
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'drag_start':
      return {
        ...state,
        x: action.x,
        y: action.y,
        selected: true,
      }
    case 'drag':
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
    x: 0,
    y: 0,
    top,
    left,
    selected: false,
    dragging: false,
  })

  useEffect(() => {
    const onmousemove = (e: MouseEvent) => {
      dispatch(drag(e.clientX, e.clientY))
    }
    document.addEventListener('mousemove', onmousemove)
    return () => {
      document.removeEventListener('mousemove', onmousemove)
    }
  }, [])
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(dragStart(e.clientX, e.clientY))
  }, [])
  const onMouseUp = useCallback((e: React.MouseEvent) => {
    dispatch(mouseup())
  }, [])

  return (
    <div id={id} 
      style={{...style, left: state.left, top: state.top}}
      className={'app-icon ' + (state.selected ? ' app-icon-clicked' : '')}
      >
      <div className="relative">
        <img 
          onDoubleClick={onDoubleClick}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          data-icon-id={id}
          src={img} />
        <span className="app-icon-name">{name}</span>
      </div>
    </div>
  );
}

export default Icon;