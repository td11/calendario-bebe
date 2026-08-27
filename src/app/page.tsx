"use client";

import { useState, useEffect } from "react";

interface VoteSummary {
  count: number;
  names: string[];
}

interface VotesData {
  [date: string]: VoteSummary;
}

function getDaysInRange(): { date: string; day: number; month: string }[] {
  const days: { date: string; day: number; month: string }[] = [];
  const startDate = new Date(2025, 8, 21);
  const endDate = new Date(2025, 9, 25);

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  for (
    let d = new Date(startDate);
    d <= endDate;
    d.setDate(d.getDate() + 1)
  ) {
    const dateStr = d.toISOString().split("T")[0];
    days.push({
      date: dateStr,
      day: d.getDate(),
      month: monthNames[d.getMonth()],
    });
  }

  return days;
}

export default function Home() {
  const [votes, setVotes] = useState<VotesData>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const days = getDaysInRange();

  useEffect(() => {
    fetchVotes();
  }, []);

  async function fetchVotes() {
    try {
      const res = await fetch("/api/votes");
      const data = await res.json();
      setVotes(data);
    } catch (error) {
      console.error("Error fetching votes:", error);
    }
  }

  async function handleVote() {
    if (!selectedDate || !name.trim()) {
      setMessage("Selecciona un día y escribe tu nombre");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), date: selectedDate }),
      });

      if (res.ok) {
        setMessage("¡Voto registrado! Gracias, " + name.trim());
        setName("");
        setSelectedDate(null);
        fetchVotes();
      } else {
        setMessage("Error al registrar el voto");
      }
    } catch {
      setMessage("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  const totalVotes = Object.values(votes).reduce(
    (sum, v) => sum + v.count,
    0
  );

  const leaderboard = Object.entries(votes)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">
            🍼 Calendario de Votación 🍼
          </h1>
          <p className="text-lg text-gray-600">
            ¿Cuándo nace la bebé? ¡Vota por el día!
          </p>
          <p className="text-sm text-gray-500 mt-1">
            21 de Septiembre - 25 de Octubre 2026
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Selecciona un día
          </h2>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {(() => {
              const firstDay = new Date(2025, 8, 21);
              const dayOfWeek = (firstDay.getDay() + 6) % 7;
              return Array.from({ length: dayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ));
            })()}
            {days.map((d) => {
              const voteCount = votes[d.date]?.count || 0;
              const isSelected = selectedDate === d.date;
              const isToday =
                d.date === new Date().toISOString().split("T")[0];

              return (
                <button
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={`
                    relative p-2 rounded-xl text-center transition-all duration-200
                    ${
                      isSelected
                        ? "bg-purple-600 text-white shadow-lg scale-105"
                        : voteCount > 0
                        ? "bg-purple-100 hover:bg-purple-200"
                        : "bg-gray-50 hover:bg-gray-100"
                    }
                    ${isToday ? "ring-2 ring-yellow-400" : ""}
                  `}
                >
                  <div
                    className={`text-lg font-bold ${
                      isSelected ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {d.day}
                  </div>
                  <div
                    className={`text-xs ${
                      isSelected ? "text-purple-200" : "text-gray-500"
                    }`}
                  >
                    {d.month.slice(0, 3)}
                  </div>
                  {voteCount > 0 && (
                    <div
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                        isSelected
                          ? "bg-yellow-400 text-purple-900"
                          : "bg-purple-500 text-white"
                      }`}
                    >
                      {voteCount}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Tu voto
          </h2>
          {selectedDate && (
            <p className="text-center text-purple-600 font-medium mb-4">
              Día seleccionado:{" "}
              {days.find((d) => d.date === selectedDate)?.day} de{" "}
              {days.find((d) => d.date === selectedDate)?.month}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Escribe tu nombre"
              className="w-full sm:w-64 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none text-center text-lg"
              onKeyPress={(e) => e.key === "Enter" && handleVote()}
            />
            <button
              onClick={handleVote}
              disabled={loading || !selectedDate || !name.trim()}
              className="w-full sm:w-auto px-8 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-lg"
            >
              {loading ? "Votando..." : "¡Votar!"}
            </button>
          </div>
          {message && (
            <p
              className={`text-center mt-4 font-medium ${
                message.includes("¡") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
            🏆 Porra / Leaderboard
          </h2>
          <p className="text-center text-gray-500 mb-4">
            {totalVotes} voto{totalVotes !== 1 ? "s" : ""} en total
          </p>
          {leaderboard.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              Aún no hay votos. ¡Sé el primero!
            </p>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => {
                const d = days.find((dd) => dd.date === entry.date);
                const barWidth = Math.max(
                  (entry.count / leaderboard[0].count) * 100,
                  10
                );

                return (
                  <div
                    key={entry.date}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0
                          ? "bg-yellow-400 text-yellow-900"
                          : index === 1
                          ? "bg-gray-300 text-gray-700"
                          : index === 2
                          ? "bg-amber-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-800">
                          {d?.day} de {d?.month}
                        </span>
                        <span className="text-sm text-gray-500">
                          {entry.count} voto{entry.count !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {entry.names.map((n, i) => (
                          <span
                            key={i}
                            className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full"
                          >
                            {n}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <footer className="text-center mt-8 text-gray-500 text-sm">
          Hecho con amor para la pequeña por venir 💜
        </footer>
      </div>
    </div>
  );
}
