"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";

// Sử dụng shouldForwardProp để loại bỏ prop isDark khỏi DOM
const ToggleButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== "isDark",
})<{ isDark: boolean }>`
  width: 50px;
  height: 25px;
  background-color: ${({ isDark }) => (isDark ? "#3d3d3d" : "#ffffff")};
  border-radius: 25px;
  border: none;
  display: flex;
  align-items: center;
  position: relative;
  padding: 3px;
  cursor: pointer;
  transition: background 0.3s ease, box-shadow 0.2s ease;

  &::before {
    content: "${({ isDark }) => (isDark ? '🐕' : '🐈')}";
    position: absolute;
    top: 50%;
    left: ${({ isDark }) => (isDark ? "23px" : "5px")};
    transform: translateY(-50%);
    font-size: 16px;
    transition: left 0.3s ease;
  }
`;

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
      return;
    }

    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const hour = new Date().getHours();
    const autoTheme = systemPrefersDark || hour >= 18 || hour < 6;

    setIsDark(autoTheme);
    document.documentElement.classList.toggle("dark", autoTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  return <ToggleButton isDark={isDark} onClick={toggleTheme} />;
}