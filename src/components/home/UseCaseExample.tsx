
interface UseCaseProps {
  name: string;
  content: string;
  inputType: string;
  style: object;
}

export default function UseCaseExample({useCase}: {useCase: UseCaseProps}) {
  return (
    <li className="flex gap-1 items-center rounded-md border border-gray-200 bg-white p-3 shadow-lg">
      <div className="flex-1 items-start flex flex-col gap-2">
        <div className="h-6 rounded-md font-bold">{useCase.name}</div>
        {useCase.inputType === 'input' &&
          <input type="text" placeholder={useCase.content}
            value={useCase.content}
            className="rounded-md border border-gray-200 p-2"
            style={useCase.style}
          />
        }
        {useCase.inputType === 'textarea' &&
          <textarea placeholder={useCase.content}
            value={useCase.content}
            className="rounded-md border border-gray-200 p-2 resize-none"
            style={useCase.style}
          />
        }
      </div>
    </li>
  )
}
