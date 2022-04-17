import React from "react";
import "./App.css";
import Title from "./components/Title";

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};
function CatItem(props) {
  return (
    <li>
      <img
        src={props.img}
        style={{
          width: "100px",
          height: "200px",
          border: "10px solid gray",
        }}
        alt="고양이"
      />
    </li>
  );
}

function Favorite({ Fav }) {
  if (Fav.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장하세요</div>;
  }
  return (
    <div className="favorites">
      {Fav.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </div>
  );
}

const MainC = ({ img, onHeartClick, alreadyHeart }) => {
  const heartIcon = alreadyHeart ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img
        src={img}
        alt="고양이"
        style={{ width: "500px", border: "10px solid gray" }}
      />
      <button onClick={onHeartClick}>{heartIcon}</button>
    </div>
  );
};

const Form = ({ onHandleFormSubmit }) => {
  const [value, setValue] = React.useState("");
  const [err, seterr] = React.useState("");
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);

  function handleInputChange(e) {
    const userValue = e.target.value;
    seterr("");
    if (includesHangul(userValue)) {
      seterr("한글은 입력할 수 없습니다");
      return;
    }

    setValue(userValue.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    seterr("");
    if (value === "") {
      seterr("입력해주세요");
      return;
    }
    onHandleFormSubmit(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
        value={value}
        onChange={handleInputChange}
      />
      <button type="submit">생성</button>
      <p style={{ color: "red" }}>{err}</p>
    </form>
  );
};

const getCats = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com/";
  const response = await fetch(`${OPEN_API_DOMAIN}cat/says/${text}?json=true`); // ajax, axios, fetch, http, await
  const data = await response.json();
  return `${OPEN_API_DOMAIN}/${data.url}`;
};

const App = () => {
  const CAT1 =
    "https://cataas.com/cat/60b73094e04e18001194a309/says/Hello React";

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });
  const [CatImage, setImage] = React.useState(CAT1);
  const [Fav, setFav] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  });

  async function setInitialCat() {
    const newCat = await getCats("First Cat");
    setImage(newCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, []);

  const alreadyHeart = Fav.includes(CatImage);
  const Null = counter === null ? "" : counter + "번째";

  async function updateMainCat(value) {
    const newCat = await getCats(value);

    setImage(newCat);

    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    });
  }

  function handleHeartClick() {
    const nextFav = [...Fav, CatImage];
    setFav(nextFav);
    jsonLocalStorage.setItem("favorites", nextFav);
  }

  return (
    <div>
      <Title>{Null} 고양이 가라사대</Title>
      <Form onHandleFormSubmit={updateMainCat} />
      <MainC
        img={CatImage}
        onHeartClick={handleHeartClick}
        alreadyHeart={alreadyHeart}
      />
      <Favorite Fav={Fav} />
    </div>
  );
};

export default App;
