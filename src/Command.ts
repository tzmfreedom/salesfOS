interface CommandInterface {
  execute (args: string[], state: ConsoleState): ConsoleState
}

const commands: {[key: string]: CommandInterface} = {
  echo: {
    execute: (args: string[], state: ConsoleState): ConsoleState => {
      return {
        ...state,
        result: `${args.join(' ')}`,
      }
    }
  },
  ls: {
    execute: (args: string[], state: ConsoleState): ConsoleState => {
      return {
        ...state,
        result: ".bashrc\n.bash_profile\nMakefile\nhoge.js",
      }
    }
  },
  cd: {
    execute: (args: string[], state: ConsoleState): ConsoleState => {
      return {
        ...state,
        result: "",
        cwd: "/home/hoge/change",
      }
    }
  }
}
interface ConsoleState {
  result: string
  cwd: string
}

export default class Command {
  execute(input: string, state: ConsoleState): ConsoleState {
    const args = input.split(/\s+/)
    if (args[0] === '') {
      return state;
    }
    const command = commands[args[0]]
    if (command) {
      return command.execute(args.slice(1), state)
    }
    return {
      ...state,
      result: `No such command: ${args[0]}`
    }
  }
}