export default function PublicQuestionView({ question, index, answerChanged }) {
  let selectedOptions = [];

  const onCheckboxChange = (option, event) => {
    if (event.target.checked) {
      selectedOptions.push(option.text);
    } else {
      selectedOptions = selectedOptions.filter((op) => op != option.text);
    }
    answerChanged(selectedOptions);
  };
  return (
    <>
      <fieldset className="mb-4">
        <div>
          <legend className="text-base font-medium text-gray-900">
            {index + 1}. {question.question}
          </legend>
          <p className="text-gray-500 text-sm">{question.description}</p>
        </div>
        <div className="mt-3">
          {question.type === "select" && (
            <div>
              <select
                name=""
                id=""
                onChange={(ev) => answerChanged(ev.target.value)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white
    rounded-md shadow-sm focus:outline-none focus:ring-indigo-500
     focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Please Select</option>
                {question.data.options.map((option) => (
                  <option key={option.uuid} value={option.text}>
                    {option.text}
                  </option>
                ))}
              </select>
            </div>
          )}

          {question.type === "radio" && (
            <div>
              {question.data.options.map((option, ind) => (
                <div key={option.uuid} className="flex items-center">
                  <input
                    type="radio"
                    name={"question" + option.uuid}
                    id={option.uuid}
                    className="focus:ring-indigo-500 h-4 w-4t text-indigo-600 border-gray-300"
                    value={option.text}
                    onChange={(ev) => answerChanged(ev.target.value)}
                  />
                  <label
                    htmlFor={option.uuid}
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    {option.text}
                  </label>
                </div>
              ))}
            </div>
          )}
          {question.type === "checkbox" && (
            <div>
              {question.data.options.map((option, ind) => (
                <div key={option.uuid} className="flex items-center">
                  <input
                    type="checkbox"
                    id={option.uuid}
                    className="focus:ring-indigo-500 h-4 w-4t text-indigo-600 border-gray-300 rounded"
                    onChange={(ev) => onCheckboxChange(option, ev)}
                  />
                  <label
                    for={option.uuid}
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    {option.text}
                  </label>
                </div>
              ))}
            </div>
          )}
          {question.type === "text" && (
            <div>
              <input
                type="text"
                onChange={(ev) => answerChanged(ev.target.value)}
                className="mt-1  focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm
                    border-gray-300 rounded-md"
              />
            </div>
          )}
          {question.type === "textarea" && (
            <div>
              <textarea
                className="mt-1  focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm
                    border-gray-300 rounded-md"
                onChange={(ev) => answerChanged(ev.target.value)}
              ></textarea>
            </div>
          )}
        </div>
      </fieldset>
    </>
  );
}
