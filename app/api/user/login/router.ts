import { NextApiRequest, NextApiResponse } from "next";
import sqlite3 from "sqlite3";

// SQLite 데이터베이스 연결
const db = new sqlite3.Database("./app/db/health_db.db", (err) => {
  if (err) {
    console.error("Database connection failed: " + err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { userId, password } = req.body;

    // SQL 쿼리: userId와 password를 검증
    const sql = `SELECT * FROM user WHERE username = ? AND password = ?`;

    db.get(sql, [userId, password], (err, row) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err.message });
      }

      if (row) {
        // 로그인 성공
        return res.status(200).json({ message: "로그인 성공!" });
      } else {
        // 로그인 실패
        return res.status(401).json({ message: "로그인 실패! 아이디 또는 비밀번호가 잘못되었습니다." });
      }
    });
  } else {
    // POST가 아닌 다른 HTTP 메서드에 대해서는 405 Method Not Allowed 응답
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
