import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { useState } from "react";
import axiosClient from "../axios";
import TButton from "../components/core/TButton";
import DashboardCard from "../components/DashboardCard";
import PageComponent from "../components/pageComponent";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/dashboard`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
        console.log(res.data);
        return res;
      })
      .catch((error) => {
        setLoading(false);
        return error;
      });
  }, []);
  return (
    <>
      <PageComponent title={"Dashboard"}>
        {loading && <div className="flex justify-center">Loading.....</div>}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-gray-700">
            <DashboardCard
              title={"Total Surveys"}
              className="order-2 lg:order-4"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
                {data.totalSurveys}
              </div>
            </DashboardCard>
            <DashboardCard
              title={"Total Answers"}
              className="order-2 lg:order-4"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="text-8xl pb-4 font-semibold flex-1 flex items-center justify-center">
                {data.totalAnswers}
              </div>
            </DashboardCard>
            <DashboardCard
              title={"Latest Surveys"}
              className="order-3 lg:order-1 row-span-2"
              style={{ animationDelay: "0.2s" }}
            >
              {data.latestSurvey && (
                <div>
                  <img
                    src={data.latestSurvey.image_url}
                    className="w-[240px] mx-auto"
                    alt=""
                  />
                  <h3 className="font-bold text-xl mb-3">
                    {data.latestSurvey.title}
                  </h3>
                  <div className="felx justify-between text-sm mb-1">
                    <div>Create Date:</div>
                    <div>{data.latestSurvey.created_at}</div>
                  </div>
                  <div className="felx justify-between text-sm mb-1">
                    <div>Expire Date:</div>
                    <div>{data.latestSurvey.expire_date}</div>
                  </div>
                  <div className="felx justify-between text-sm mb-1">
                    <div>Status:</div>
                    <div>{data.latestSurvey.status ? "Active" : "Draft"}</div>
                  </div>

                  <div className="felx justify-between text-sm mb-1">
                    <div>Questions:</div>
                    <div>{data.latestSurvey.questions}</div>
                  </div>

                  <div className="felx justify-between text-sm mb-1">
                    <div>Answers:</div>
                    <div>{data.latestSurvey.answers}</div>
                  </div>

                  <div className="flex justify-between">
                    <TButton to={`/surveys/${data.latestSurvey.id}`} link>
                      <PencilIcon className="w-5 h-5 mr-2" />
                      Edite Survey
                    </TButton>

                    <TButton link>
                      <EyeIcon className="w-5 h-5 mr-2" />
                      View Answers
                    </TButton>
                  </div>
                </div>
              )}

              {!data.latestSurvey && (
                <div className="text-gray-600 text-center py-16">
                  You Don't have Surveys yet.
                </div>
              )}
            </DashboardCard>
            <DashboardCard
              title="Latest Answers"
              className="order-4 lg:order-3 row-span-2"
              style={{ animationDelay: "0.3s" }}
            >
              {data.latestAnswers && (
                <div className="text-left">
                  {data.latestAnswers.map((answer) => (
                    <a
                      href="#"
                      key={answer.id}
                      className="block p-2 hover:bg-gray-100/90"
                    >
                      <div className="font-semibold">{answer.survey.title}</div>
                      <small>
                        Answer Made at:
                        <i className="font-semibold">{answer.end_date}</i>
                      </small>
                    </a>
                  ))}
                </div>
              )}
              {!data.latestAnswers && (
                <div className="text-gray-600 text-center py-16">
                  Your don't have answers yet
                </div>
              )}
            </DashboardCard>
          </div>
        )}
      </PageComponent>
    </>
  );
};

export default Dashboard;
