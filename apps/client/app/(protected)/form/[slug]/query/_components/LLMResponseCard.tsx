import formatDate from "../../../../../../lib/helpers/formatDate";
import { Chat } from "../../../../../../types/query.type";

export default function LLMResponseCard(props: Chat) {
  return (
    <div className="w-full flex flex-col gap-6 p-7 border border-gray-200 rounded-md">
      {/* Question */}
      <div className="w-full space-y-2">
        <h2 className="text-lg font-medium">{props.query.question}</h2>
        <p className="text-right">{formatDate(props.query.createdAt)}</p>
      </div>

      {/* LLM response */}
      <div className="w-full flex flex-col gap-4 p-4 border border-gray-200 rounded-md">
        <h2 className="font-medium">LLM response:</h2>

        {props.llmResponse.length > 0 &&
          props.llmResponse.map((l, i) => (
            <div
              key={i}
              className="w-full flex flex-col gap-2 p-2 border border-gray-200 rounded-md"
            >
              {/* <p>{l.submissionId}</p> */}
              <p>{l.document}</p>
              <p>{l.reasoning}</p>
            </div>
          ))}
      </div>

      {/* Sources */}
      <div className="w-full flex flex-col gap-4 p-4 border border-gray-200 rounded-md">
        <h2 className="font-medium">Sources:</h2>

        {props.sources.length > 0 &&
          props.sources.map((s, idx) => (
            <div
              key={idx}
              className="w-full flex flex-col gap-2 p-2 border border-gray-200 rounded-md"
            >
              <p>Id : {s.submissionId}</p>
              <p>Record : {s.document}</p>
              {/* <p>{s.distance}</p> */}
            </div>
          ))}
      </div>
    </div>
  );
}
