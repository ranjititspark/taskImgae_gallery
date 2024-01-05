import axios from "axios";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEmpty, setLoadedImages } from "../redux/imageSlice";
import { config } from "../apiEndPoints/config";
import "./ImagesList.css";

function ImagesList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loader, setLoader] = useState("false");
  const imageData = useSelector((state) => state.images);
  const dispatch = useDispatch();
  const page = useRef(1);

  const fetchImages = async (search) => {
    setLoader(true);
    const perPage = 10;
    let apiUrl = `${config.BASE_URl}/photos?page=${page.current}&per_page=${perPage}&client_id=${config.ACCESS_KEY}`;
    if (search) {
      apiUrl = `${config.BASE_URl}/search/photos?page=1&query=${search}&page=${page.current}&per_page=${perPage}&client_id=${config.ACCESS_KEY}`;
    }
    try {
      const res = await axios.get(apiUrl);
      const data = res.data;
      setLoader(false);
      const rateLimitRemaining = res.headers.get("X-Ratelimit-Remaining");
      if (rateLimitRemaining == 0) {
        alert("Api limit reached please try after sometimes");
      }
      if (data?.results?.length) {
        dispatch(setEmpty());
        dispatch(setLoadedImages(data.results));
      } else {
        dispatch(setLoadedImages(data));
      }
      page.current += 1;
    } catch (error) {
      setLoader(false);
      console.error("Error fetching images:", error);
    }
  };

  const handleScroll = () => {
    const halfwayPoint = document.body.offsetHeight / 2;
    const scrolledPastHalfway =
      window.innerHeight + window.scrollY >= halfwayPoint - 100;

    if (scrolledPastHalfway) {
      fetchImages(searchTerm);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handelSearchBar = (e) => {
    setSearchTerm(e.target.value);
  };
  const handelSearch = () => {
    fetchImages(searchTerm);
    setSearchTerm("");
  };
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div>
      <div className="search-bar d-flex justify-content-center align-items-center">
        <input
          type="text"
          placeholder="Search for high-resolution photos"
          value={searchTerm}
          onChange={handelSearchBar}
        />
        <button onClick={handelSearch}>Search</button>
        <div className="menu-item">Explore</div>
        <div className="menu-item">Advertise</div>
        <div className="menu-item">Unsplash</div>
        <div className="menu-item">Login</div>
        <div className="menu-item btn btn-light bg-white">Submit a photo</div>
      </div>
      {loader && (
        <div className="d-flex justify-content-center m-2">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div className="image-list">
        {imageData.loadedImages.map((image, index) => (
          <img
            key={index}
            src={image.urls.regular}
            alt={image.alt_description}
          />
        ))}
      </div>
    </div>
  );
}

export default ImagesList;
