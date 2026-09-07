const players = globalThis.__ROBLOX_PLAYERS__ ||
  (globalThis.__ROBLOX_PLAYERS__ = new Map());

const SECRET = process.env.DASHBOARD_SECRET || "GANTI_SECRET_KAMU";

function cleanNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  if (req.headers["x-dashboard-secret"] !== SECRET) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  try {
    const data = req.body || {};

    if (!data.userId || !data.username) {
      return res.status(400).json({
        error: "Missing user data"
      });
    }

    const pets = Array.isArray(data.pets)
      ? data.pets.map(pet => ({
          name: String(pet.name || "Unknown"),
          rarity: String(pet.rarity || "Unknown"),
          income: cleanNumber(pet.income)
        }))
      : [];

    pets.sort((a, b) => b.income - a.income);

    const bestPet = pets.length > 0
      ? pets[0]
      : null;

    const player = {
      userId: String(data.userId),
      username: String(data.username),

      income: cleanNumber(data.income),
      money: cleanNumber(data.money),
      speed: cleanNumber(data.speed),

      petEquip: pets.length,
      bestPet,

      pets,

      lastUpdate: Date.now()
    };

    players.set(player.userId, player);

    return res.status(200).json({
      success: true,
      bestPet
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error"
    });
  }
        }
