import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { FaRandom, FaThumbsDown, FaThumbsUp, FaTimes } from "react-icons/fa";
import { IoSadSharp } from "react-icons/io5";
import { HiInformationCircle } from "react-icons/hi";
import { GoArrowDown } from "react-icons/go";
import { RiGithubFill } from "react-icons/ri";
import { useForm } from "react-hook-form";
import accentCenter from "./images/accent-center.svg";
import "./App.css";

interface Form {
  review: string;
}

interface Result {
  result: "dilemma" | "positive" | "negative" | "uncoverage";
  original: string;
  processed: string;
  tokenized: number[];
  classification: number[];
}

const baseURL = window.location.origin.toString();

const getReviewClassification = async (text: string) => {
  const result = await axios.get(
    baseURL + "/review?text=" + encodeURIComponent(text.trim())
  );

  if (result.status !== 200) {
    throw new Error("server error");
  }

  return result.data as Result;
};

const getRandomReview = async (total: number) => {
  const result = await axios.get(baseURL + "/random?total=" + total);

  if (result.status !== 200) {
    throw new Error("server error");
  }

  return result.data as string[];
};

function App() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isValid },
  } = useForm<Form>({ mode: "onChange" });
  const [info, setInfo] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>();
  const [randoms, setRandoms] = useState<string[]>();

  useEffect(() => {
    getRandomReview(3).then((texts) => setRandoms(texts));
    setInterval(
      () => getRandomReview(3).then((texts) => setRandoms(texts)),
      5000
    );
  }, []);

  const onSumbit = async (data: Form) => {
    if (data.review) {
      setLoading(true);

      const result = await getReviewClassification(data.review);

      setResult(result);
      setLoading(false);
    }
  };

  const onClear = () => {
    reset();
    setResult(undefined);
    setLoading(false);
  };

  const setReview = async (text: string) => {
    setValue("review", text);
    handleSubmit(onSumbit)();
  };

  const onRandom = async () => {
    const randoms = await getRandomReview(1);
    setReview(randoms[0]);
  };

  const disabled = loading || !!result;

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      padding: 0,
      background: "transparent",
      border: 0,
    },
    overlay: {
      background: "rgba(0,0,0,0.5)",
    },
  };

  return (
    <div
      className="w-full min-h-screen text-center text-white relative"
      style={{
        backgroundImage: `url(${accentCenter}), linear-gradient(249.77deg,#0094ff -1.99%,#007dff 43.52%,#026ce8 95.86%)`,
        backgroundBlendMode: "lighten",
        backgroundPositionX: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Modal
        style={customStyles}
        isOpen={info}
        onRequestClose={() => setInfo(false)}
      >
        <div className="relative w-full max-w-2xl px-4 h-full md:h-auto bg-transparent">
          <div className="bg-white rounded-lg shadow relative dark:bg-gray-700">
            <div className="flex items-start justify-between p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-gray-900 text-xl lg:text-2xl font-semibold dark:text-white">
                Informasi & Batasan
              </h3>
              <button
                onClick={() => setInfo(false)}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="default-modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="px-6 py-6 space-y-6">
              <p className="text-gray-500 text-base leading-relaxed dark:text-gray-400">
                Product Review Classification adalah tools untuk menganalisis
                sentimen pada ulasan produk yang anda input, ada 2 keluaran
                utama yang diharapkan yaitu <b>POSITIF</b> dan <b>NEGATIF</b>{" "}
                yang menandakan kecerendungan ulasan anda.
              </p>
              <p className="text-gray-500 text-base leading-relaxed dark:text-gray-400">
                Klasifikasi akan menampilkan hasil <b>TIDAK DIKETAHUI</b> jika
                kata pada ulasan yang diinput <b>lebih dari 40%</b> (
                <u>ambang batas yang ditetapkan</u>) tidak dikenali oleh program
                atau jika hasil klasifikasi <b>tidak lebih dari 60%</b> (
                <u>ambang batas yang ditetapkan</u>
                ).
              </p>
              <p className="text-gray-500 text-base leading-relaxed dark:text-gray-400">
                <div className="text-lg font-bold underline">BATASAN: </div>{" "}
                Model yang dibangun pada tools ini ditujukan untuk{" "}
                <b>ulasan produk FMCG (Fast-Moving Consumer Goods)</b> sehingga
                ulasan produk yang dianalisis hanya berfokus pada produk FMCG.
                Data latih yang digunakan mengambil sample ulasan produk yang
                dijual oleh Official Store Unilever & Nestle pada marketplace
                Tokopedia.
              </p>
              <p className="text-gray-500 text-base leading-relaxed dark:text-gray-400">
              Tools ini dibuat oleh Aldi Permana Etika Putra dari Kelompok 1 (ITS-01) untuk memenuhi tugas
                besar{" "}
                <b>Microcredential Certification - Associate Data Scientst</b>{" "}
                oleh Kemenristekdikti.
              </p>
            </div>
          </div>
        </div>
      </Modal>
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 py-36 px-6">
          <h1 className="text-2xl md:text-5xl font-semibold">
            Product Review Classification
          </h1>
          <div className="md:text-lg">
            Prediksi sentimen ulasan produk anda disini hanya dengan sekali
            klik.
          </div>
          <form onSubmit={handleSubmit(onSumbit)}>
            <div className="w-10/12 sm:w-8/12 lg:w-6/12 mx-auto my-6 md:my-12">
              <div className="md:flex flex-row justify-between items-center md:space-x-2 space-y-2 md:space-y-0">
                <div
                  className={`${
                    disabled ? "opacity-80" : "opacity-100"
                  } relative flex-1 text-black rounded-full shadow-md py-4 px-6 bg-white text-center mx-auto flex flex-row items-center`}
                >
                  <input
                    {...register("review", {
                      validate: (text: string) =>
                        text.trim().split(" ").length >= 3,
                    })}
                    type="text"
                    disabled={disabled}
                    name="review"
                    id="review"
                    autoComplete="off"
                    className="w-full bg-transparent h-full appearance-none focus:outline-none focus:ring-0 border-0 text-lg"
                    placeholder="Ketik review anda minimal 3 kata"
                  />
                  {!!result ? (
                    <button type="button" onClick={onClear}>
                      <FaTimes className="text-2xl text-red-600" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onRandom}
                      disabled={disabled}
                    >
                      <FaRandom className="text-2xl text-gray-500 hover:text-gray-800 transition-colors ease-in duration-400" />
                    </button>
                  )}
                </div>
                <button
                  disabled={disabled || !isValid}
                  type="submit"
                  className="disabled:opacity-80 text-center font-semibold w-full md:w-40 py-5 px-6 text-lg bg-yellow-500 text-white rounded-full shadow-lg"
                >
                  {loading ? "Memproses..." : "Cek Review"}
                </button>
              </div>
              {randoms && (
                <div className="mt-3 md:flex md:flex-row text-xs md:px-6 space-x-2 max-w-full overflow-hidden">
                  <div className="md:w-28">Random Review: </div>
                  {randoms.map((text) => (
                    <button
                      type="button"
                      onClick={() => setReview(text)}
                      className="underline flex-1 w-full truncate"
                    >
                      {text}
                    </button>
                  ))}
                </div>
              )}
              {result && (
                <div className="mt-8">
                  {(result.result === "positive" && (
                    <div>
                      <div className="text-3xl inline-flex space-x-4 items-center animate-bounce">
                        <div className="text-2xl">Hasil :</div>
                        <div className="font-semibold flex space-x-2 text-green-200">
                          <FaThumbsUp />
                          <span>POSITIF</span>
                        </div>
                      </div>
                      <div className=" text-sm italic text-gray-200">
                        Review yang anda masukkan cenderung{" "}
                        <b>
                          {Math.round(result.classification[1] * 100)}% positif
                        </b>
                      </div>
                    </div>
                  )) ||
                    (result.result === "negative" && (
                      <div>
                        <div className="text-3xl inline-flex space-x-4 items-center animate-bounce">
                          <div className="text-2xl">Hasil :</div>
                          <div className="font-semibold flex space-x-2 text-red-200">
                            <FaThumbsDown />
                            <span>NEGATIF</span>
                          </div>
                        </div>
                        <div className=" text-sm italic text-gray-200">
                          ulasan yang anda masukkan cenderung{" "}
                          <b>
                            {Math.round(result.classification[0] * 100)}%
                            negatif
                          </b>
                        </div>
                      </div>
                    )) ||
                    (result.result === "dilemma" && (
                      <div>
                        <div className="text-3xl inline-flex space-x-4 items-center animate-bounce">
                          <div className="text-2xl">Hasil :</div>
                          <div className="font-semibold flex space-x-2 text-yellow-200">
                            <IoSadSharp />
                            <span>TIDAK DIKETAHUI</span>
                          </div>
                        </div>
                        <div className=" text-sm italic text-gray-200">
                          Kami dilema untuk menentukan sentimen ulasan anda.
                          Silahkan ubah ulasan anda
                        </div>
                      </div>
                    )) ||
                    (result.result === "uncoverage" && (
                      <div>
                        <div className="text-3xl inline-flex space-x-4 items-center animate-bounce">
                          <div className="text-2xl">Hasil :</div>
                          <div className="font-semibold flex space-x-2 text-yellow-200">
                            <IoSadSharp />
                            <span>TIDAK DIKETAHUI</span>
                          </div>
                        </div>
                        <div className=" text-sm italic text-gray-200">
                          Kami tidak mengenali sebagian besar ulasan anda.
                          Silahkan ubah ulasan anda
                        </div>
                      </div>
                    ))}
                  <div className="mt-10 text-center">
                    <div>
                      <div className="underline text-sm">Raw Text</div>
                      <div className="text-sm italic text-gray-200">
                        {result.original}
                      </div>
                      <div className="text-xs text-yellow-300 font-semibold">
                        ({result.original.split(" ").length} words)
                      </div>
                    </div>
                    <GoArrowDown className="mx-auto text-2xl" />
                    <div>
                      <div className="underline text-sm">Processed Text</div>
                      <div className="text-sm italic text-gray-200">
                        {result.processed}
                      </div>
                      <div className="text-xs text-yellow-300 font-semibold">
                        ({result.processed.split(" ").length} words)
                      </div>
                    </div>
                    <GoArrowDown className="mx-auto text-2xl" />
                    <div>
                      <div className="underline text-sm">
                        Tokenized Sequences
                      </div>
                      <div className="text-sm italic text-gray-200">
                        [{result.tokenized.join(", ")}]
                      </div>
                      <div className="text-xs text-yellow-300 font-semibold">
                        (
                        {Math.round(
                          (result.tokenized.length /
                            (result.processed.split(" ").length || 1)) *
                            100
                        )}
                        % coverage)
                      </div>
                    </div>
                    <GoArrowDown className="mx-auto text-2xl" />
                    <div>
                      <div className="underline text-sm">
                        Classification Result
                      </div>
                      <div className="text-sm italic text-gray-200">
                        [{result.classification.join(", ")}]
                      </div>
                    </div>
                    <div className="text-xs text-yellow-300 font-semibold">
                      (negative, positive)
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="mx-auto text-5xl flex space-x-1 pb-4">
          <button
            type="button"
            onClick={() => setInfo(true)}
            className="opacity-60 hover:opacity-100 transition-opacity duration-200 "
          >
            <HiInformationCircle />
          </button>
          <a
            href="https://github.com/aldipermanaetikaputra/product-review-classification"
            target="_blank"
            rel="noreferrer"
            className="opacity-60 hover:opacity-100 transition-opacity duration-200 "
          >
            <RiGithubFill />
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
