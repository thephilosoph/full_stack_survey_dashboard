import { LinkIcon, PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useEffect } from "react";
import { useState } from "react";
import TButton from "../components/core/TButton";
import PageComponent from "../components/pageComponent";
import axiosClient from "../axios";
import { useNavigate, useParams } from "react-router-dom";
import SurveyQuestions from "../components/surveyQuestions";
import { useStateContext } from "../contexts/ContextProvider";
const SurveyView = () => {
  const navigate = useNavigate();
  const { showToast } = useStateContext();
  const [survey, setSurvey] = useState({
    title: "",
    slug: "",
    status: false,
    description: "",
    image: null,
    image_url: null,
    expire_date: "",
    questions: [],
  });
  const [error, setError] = useState("");
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const onImageChoose = (ev) => {
    const file = ev.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setSurvey({
        ...survey,
        image: file,
        image_url: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    const payLoad = { ...survey };
    console.log(payLoad);
    if (payLoad.image) {
      payLoad.image = payLoad.image_url;
    }
    delete payLoad.image_url;
    let res = null;
    if (id) {
      res = axiosClient.put(`/survey/${id}`, payLoad);
    } else {
      res = axiosClient.post("survey", payLoad);
    }
    res
      .then((res) => {
        console.log(res);
        navigate("/surveys");
        if (id) {
          showToast("The survey was updated ");
        } else {
          showToast("The survey was created");
        }
      })
      .catch((error) => {
        // console.log(error);
        if (error && error.response) {
          setError(error.response.data.message);
        }
      });
  };

  function onQuestionsUpdate(questions) {
    setSurvey({
      ...survey,
      questions,
    });
  }

  const onDelete = () => {};

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/survey/${id}`).then(({ data }) => {
        setSurvey(data.data);
        setLoading(false);
      });
    }
  }, []);

  return (
    <PageComponent
      title={!id ? "create new Survey" : "Update Survey"}
      buttons={
        <div className="flex gap-2">
          <TButton color="green" href={`/survey/${survey.slug}`}>
            <LinkIcon className="h-4 w-4 mr-2" />
            Public Link
          </TButton>
          <TButton color="red" onClick={onDelete}>
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </TButton>
        </div>
      }
    >
      {loading && <div className="text-center text-lg">Loading....</div>}
      {!loading && (
        <form action="#" method="post" onSubmit={onSubmit}>
          <div className="shadow sm:overflow-hidden sm:rounded-md">
            <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
              {error && (
                <div className="bg-red-500 text-white py-2 px-3 rounded-lg">
                  {error}
                </div>
              )}

              {/**image */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Photo
                </label>

                <div className="mt-1 flex items-center">
                  {survey.image_url && (
                    <img
                      src={survey.image_url}
                      alt=""
                      className="w-32 h-32 object-cover"
                    />
                  )}

                  {!survey.image_url && (
                    <span className="flex justify-center items-center text-gray-400 h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                      <PhotoIcon className="w-8 h-8" />
                    </span>
                  )}

                  <button
                    type="button"
                    className="relative ml-5 rounded-md border border-gray-300
                   bg-white py-2 px-3 text-sm font-medium 
                   leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                    focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <input
                      type="file"
                      className="absolute top-0 bottom-0 left-0 right-0 opacity-0"
                      onChange={onImageChoose}
                    />
                    Change
                  </button>
                </div>
              </div>
              {/**Title */}
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Survey Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={survey.title}
                  onChange={(ev) => {
                    setSurvey({ ...survey, title: ev.target.value });
                  }}
                  placeholder="Survey Title"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/**Description */}
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  value={survey.description}
                  onChange={(ev) => {
                    setSurvey({ ...survey, description: ev.target.value });
                  }}
                  placeholder="Survey Description"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/**expire Date */}
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="expire_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Expire Date
                </label>
                <input
                  type="date"
                  name="expire_date"
                  id="expire_date"
                  value={survey.expire_date}
                  onChange={(ev) => {
                    setSurvey({ ...survey, expire_date: ev.target.value });
                  }}
                  placeholder="Survey Expire Date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/*Active*/}
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="status"
                    name="status"
                    type="checkbox"
                    checked={survey.status}
                    onChange={(ev) =>
                      setSurvey({ ...survey, status: ev.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="comments"
                    className="font-medium text-gray-700"
                  >
                    Active
                  </label>
                  <p className="text-gray-500">
                    Whether to make survey publicly available
                  </p>
                </div>
              </div>
              {/*Active*/}

              <SurveyQuestions
                questions={survey.questions}
                onQuestionsUpdate={onQuestionsUpdate}
              />
            </div>

            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
              <TButton>Save</TButton>
            </div>
          </div>
        </form>
      )}
    </PageComponent>
  );
};

export default SurveyView;
