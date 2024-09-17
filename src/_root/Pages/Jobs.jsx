import {
  RiAddLine,
  RiAtLine,
  RiBriefcase2Line,
  RiCalendar2Line,
  RiCheckboxCircleLine,
  RiCloseLine,
  RiMailAddLine,
  RiMailLine,
  RiTeamLine,
  RiUserLine,
} from "react-icons/ri";
import useFetchJobs from "../../hooks/useFetchJobs";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
} from "@material-tailwind/react";
import Wrapper from "../layouts/Wrapper";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../utils/constant";
import toast from "react-hot-toast";
import OTPInput from "react-otp-input";

const Jobs = () => {
  const { jobs, loading, error: isError } = useFetchJobs();
  const [open, setOpen] = useState(false);

  const [jobData, setJobData] = useState({
    companyName: "",
    role: "",
    applicationLink: "",
    contributor: "",
    contributorEmail: "",
  });

  const handleJobContent = (e) => {
    const { name, value } = e.target;
    setJobData({
      ...jobData,
      [name]: value,
    });
  };

  const [postJobModal, setPostJobModal] = useState(false);

  const [SubscriberData, setSubscriberData] = useState({
    name: "",
    email: "",
  });

  const [subscribeMessage, setSubscribeMessage] = useState(""); // To display subscription result
  const [stepsJob, setStepsJob] = useState(1);
  const [otp, setOtp] = useState("");
  const [jobLoading, setJobLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpen = () => {
    setOpen(!open);
    setSubscriberData({
      name: "",
      email: "",
    });
    setSubscribeMessage("");
  };

  const handleOtpVerify = async () => {
    setJobLoading(true);
    if (!otp) {
      toast.error("OTP is required");
      setJobLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/post-job/verify?otp=${otp}`,
        jobData
      );

      console.log(res.data);
      setStepsJob(1);
      setPostJobModal(false);
      toast.success(res.data.message || "Job posted successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "An error occurred");
      setError(error.response.data.message || "An error occurred");
    } finally {
      setJobLoading(false);
    }
  };

  const handleJobPost = async (e) => {
    e.preventDefault();
    setJobLoading(true);

    const {
      companyName,
      role,
      applicationLink,
      contributor,
      contributorEmail,
    } = jobData;

    if (
      !companyName ||
      !role ||
      !applicationLink ||
      !contributor ||
      !contributorEmail
    ) {
      toast.error("All fields are required");
      setJobLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/post-job`, jobData);
      console.log(response.data);
      toast.success(response.data.message || "Job posted successfully");
      setStepsJob(2);
    } catch (error) {
      console.log(error);
    } finally {
      setJobLoading(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/subscribe-newsletter`,
        SubscriberData,
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );

      setSubscribeMessage(response.data.message || "Subscription successful");
      setSubscriberData({
        name: "",
        email: "",
      });
    } catch (error) {
      if (error.response && error.response.data) {
        setSubscribeMessage(
          error.response.data.message || "Subscription failed"
        );
      } else {
        setSubscribeMessage("Subscription failed. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    setSubscriberData({
      ...SubscriberData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div>
        <div className="flex flex-row items-center justify-between flex-wrap gap-4 gap-y-4 p-4 py-4">
          <h4 className="text-2xl font-semibold">Job News</h4>
          <div className="flex flex-row items-center gap-2">
            <Button
              className="font-primary text-sm text-black normal-case font-semibold flex flex-row  items-center gap-2"
              color="white"
              onClick={() => setPostJobModal(true)}
            >
              <RiAddLine />
              <span>Post Job</span>
            </Button>
            <Button
              className="font-primary text-sm text-black normal-case font-semibold flex flex-row  items-center gap-2"
              color="white"
              onClick={handleOpen}
            >
              <RiMailAddLine />
              <span>Subscribe</span>
            </Button>
          </div>
        </div>
        <div className="p-4 mt-2 py-3 bg-[#191919] border-t border-b border-white/5">
          <Wrapper>
            <div className="flex flex-row items-center gap-4">
              <div className="flex flex-row items-center gap-2 text-sm">
                <RiTeamLine className="text-lg" />
                <span className="text-white/90">
                  {jobs && jobs.length} Jobs
                </span>
              </div>
              <div className="flex flex-row items-center gap-2 text-sm">
                <RiMailLine className="text-lg" />
                {/* todo  */}
                <span className="text-white/90">100+ Subscribers</span>
              </div>
            </div>
          </Wrapper>
        </div>
        <Wrapper>
          <div className="mt-6 pb-12">
            <h2 className="text-lg">Latest Jobs Opportunities</h2>
            <div className="mt-6">
              {loading ? (
                <div className="w-full h-full min-h-[calc(100dvh_-_200px)] grid place-content-center">
                  Loading...
                </div>
              ) : error ? (
                <div className=" w-full h-full min-h-[calc(100dvh_-_400px)] grid place-content-center">
                  {isError}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobs.map((job, index) => (
                    <div
                      key={index}
                      className="border rounded border-white/10 py-4 bg-[#191919] p-4"
                    >
                      <div className="flex flex-col  gap-2">
                        <div className="flex flex-row items-center w-full justify-between">
                          <RiBriefcase2Line className="text-5xl" />
                          <div className="flex flex-row items-center gap-1">
                            <div>
                              <RiCalendar2Line />
                            </div>
                            <span className="text-sm">{job.datePosted}</span>
                          </div>
                        </div>
                        <span className="text-lg">{job.role} Role</span>
                      </div>
                      <div className="flex flex-row items-center gap-2 text-base text-white/70">
                        <RiAtLine />
                        <span>{job.company}</span>
                      </div>
                      <div className="mt-4 flex flex-row items-center gap-4">
                        <div className="flex flex-row items-center gap-1 text-sm">
                          <RiUserLine />
                          <span>{job.contributorName}</span>
                        </div>
                        <div className="flex flex-row items-center gap-1 text-sm">
                          <RiMailLine />
                          <span>{job.contributorEmail}</span>
                        </div>
                      </div>
                      <div className="mt-6 w-full">
                        <Button
                          className="font-primary text-sm text-black normal-case font-semibold w-full"
                          color="white"
                          onClick={() => {
                            const url = job.link.startsWith("http")
                              ? job.link
                              : `https://${job.link}`;
                            window.open(url, "_blank");
                          }}
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Wrapper>
      </div>

      <Dialog
        open={postJobModal}
        handler={setPostJobModal}
        className="bg-[#000000] text-white border border-white/20 rounded-lg"
        size="xxl"
      >
        <DialogHeader className="flex flex-row items-center justify-between border-b border-white/15">
          <span className="font-primary text-white font-normal text-xl">
            New Job Opportunity
          </span>
          <IconButton
            className="text-xl bg-red-500/40"
            onClick={() => {
              setPostJobModal(false);
              setJobData({
                companyName: "",
                role: "",
                applicationLink: "",
                contributor: "",
                contributorEmail: "",
              });
            }}
          >
            <RiCloseLine />
          </IconButton>
        </DialogHeader>
        <DialogBody>
          {stepsJob === 1 ? (
            <form className="flex flex-col gap-4" onSubmit={handleJobPost}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-primary font-normal text-white/70">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={jobData.companyName}
                    onChange={handleJobContent}
                    className="w-full bg-[#191919]/50 border border-white/20 rounded p-3 placeholder:text-white/20 text-white font-primary font-normal text-sm"
                    placeholder="John Doe"
                    required
                    disabled={jobLoading}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-primary font-normal text-white/70">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={jobData.role}
                    onChange={handleJobContent}
                    className="w-full bg-[#191919]/50 border border-white/20 rounded p-3 placeholder:text-white/20 text-white font-primary font-normal text-sm"
                    placeholder="John Doe"
                    required
                    disabled={jobLoading}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-primary font-normal text-white/70">
                    Application Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="applicationLink"
                    value={jobData.applicationLink}
                    onChange={handleJobContent}
                    className="w-full bg-[#191919]/50 border border-white/20 rounded p-3 placeholder:text-white/20 text-white font-primary font-normal text-sm"
                    placeholder="https://"
                    required
                    disabled={jobLoading}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-primary font-normal text-white/70">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contributor"
                    value={jobData.contributor}
                    onChange={handleJobContent}
                    className="w-full bg-[#191919]/50 border border-white/20 rounded p-3 placeholder:text-white/20 text-white font-primary font-normal text-sm"
                    placeholder="John Doe"
                    required
                    disabled={jobLoading}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-primary font-normal text-white/70">
                    Your Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="contributorEmail"
                    value={jobData.contributorEmail}
                    onChange={handleJobContent}
                    className="w-full bg-[#191919]/50 border border-white/20 rounded p-3 placeholder:text-white/20 text-white font-primary font-normal text-sm"
                    placeholder="example@gmail.com"
                    required
                    disabled={jobLoading}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="font-primary text-sm text-black normal-case font-semibold flex flex-row items-center justify-center gap-2 max-w-max mt-6"
                color="white"
                loading={jobLoading}
                disabled={jobLoading}
              >
                <RiAddLine />
                <span>Verify Email</span>
              </Button>
            </form>
          ) : (
            <div className="flex flex-col gap-2 items-center justify-center">
              <div className="flex flex-col gap-2 text-center mt-8 mb-8">
                <h4 className="text-2xl text-white font-primary max-w-[400px] mx-auto">
                  Verify your email address to post a job opportunity
                </h4>
                <p className="text-base text-white/70 font-primary">
                  A verification email has been sent to{" "}
                  {jobData.contributorEmail}
                </p>
              </div>
              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                renderSeparator={""}
                inputType="number"
                containerStyle={
                  "flex flex-row gap-4 justify-center rounded-md flex-wrap"
                }
                inputStyle={
                  "!w-10 sm:!w-14 !h-12 bg-[#191919]/50 text-text text-center rounded-md border border-white/20 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-white/50 font-primary font-normal text-lg"
                }
                renderInput={(props) => <input {...props} />}
                disabled={jobLoading}
              />
              <Button
                className="font-primary text-sm text-black normal-case font-semibold flex flex-row items-center justify-center gap-2 w-full sm:max-w-max mt-6"
                color="white"
                onClick={handleOtpVerify}
                loading={jobLoading}
                disabled={jobLoading}
              >
                <span>Verify OTP</span>
              </Button>
            </div>
          )}
        </DialogBody>
      </Dialog>

      <Dialog
        open={open}
        handler={handleOpen}
        className="bg-[#000000] text-white border border-white/20 rounded-lg"
        size="sm"
      >
        <DialogHeader className="flex flex-row items-center justify-between">
          <span className="font-primary text-white font-normal text-xl">
            Subscribe to Job News
          </span>
          <IconButton className="text-xl bg-red-500/40" onClick={handleOpen}>
            <RiCloseLine />
          </IconButton>
        </DialogHeader>
        <DialogBody>
          <form className="flex flex-col gap-4" onSubmit={handleSubscribe}>
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-primary font-normal text-white/70">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={SubscriberData.name}
                onChange={handleChange}
                className="w-full bg-[#191919]/50 border border-white/20 rounded p-3 text-white font-primary font-normal text-sm"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-primary font-normal text-white/70">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={SubscriberData.email}
                onChange={handleChange}
                className="w-full bg-[#191919]/50 border border-white/20 rounded p-3 text-white font-primary font-normal text-sm"
                placeholder="example@gmail.com"
                required
              />
            </div>
            <Button
              type="submit"
              className="font-primary text-sm text-black normal-case font-semibold flex flex-row items-center justify-center gap-2"
              color="white"
            >
              <RiMailAddLine />
              <span>Subscribe</span>
            </Button>
          </form>
          {subscribeMessage && (
            <div className="flex flex-row items-center justify-center gap-2 bg-green-500/10 text-green-600 mt-4 p-2 rounded border border-green-500 font-primary">
              <RiCheckboxCircleLine />
              <p className="text-sm text-green-500">{subscribeMessage}</p>
            </div>
          )}
        </DialogBody>
      </Dialog>
    </>
  );
};

export default Jobs;
