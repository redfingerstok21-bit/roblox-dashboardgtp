
const players = globalThis.__ROBLOX_PLAYERS__ ||
  (globalThis.__ROBLOX_PLAYERS__ = new Map());

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const now = Date.now();

  // Hapus akun yang tidak mengirim update
  for (const [id, player] of players) {
    if (now - player.lastUpdate > 15000) {
      players.delete(id);
    }
  }

  const result = Array.from(players.values());

  return res.status(200).json({
    success: true,
    count: result.length,
    players: result
  });
}
