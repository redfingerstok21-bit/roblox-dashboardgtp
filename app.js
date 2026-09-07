const dashboard = document.getElementById("dashboard");

function formatNumber(value) {

  value = Number(value) || 0;

  if (value >= 1e12)
    return (value / 1e12).toFixed(2) + "T";

  if (value >= 1e9)
    return (value / 1e9).toFixed(2) + "B";

  if (value >= 1e6)
    return (value / 1e6).toFixed(2) + "M";

  if (value >= 1e3)
    return (value / 1e3).toFixed(2) + "K";

  return value.toLocaleString("id-ID");
}


function render(players) {

  if (!players.length) {

    dashboard.innerHTML = `
      <div class="panel">
        <h2>🟡 Tidak ada akun monitoring aktif</h2>

        <p>
          Jalankan script monitoring pada akun yang ingin ditampilkan.
        </p>
      </div>
    `;

    return;
  }


  dashboard.innerHTML = players.map(player => {

    const best = player.bestPet;

    const pets = player.pets || [];

    return `

      <div class="player">

        <h2>
          👤 ${escapeHtml(player.username)}
        </h2>

        <div class="cards">

          <div class="card">
            <h3>INCOME/S</h3>

            <div class="value">
              ${formatNumber(player.income)}/s
            </div>
          </div>


          <div class="card">
            <h3>MONEY</h3>

            <div class="value">
              ${formatNumber(player.money)}
            </div>
          </div>


          <div class="card">
            <h3>SPEED</h3>

            <div class="value">
              ${formatNumber(player.speed)}
            </div>
          </div>


          <div class="card">
            <h3>PET EQUIP</h3>

            <div class="value">
              ${player.petEquip}
            </div>
          </div>

        </div>


        <div class="content">


          <div class="panel">

            <h2>👑 BEST PET</h2>

            ${
              best
              ?
              `
                <div class="best-pet">

                  <h1>
                    ${escapeHtml(best.name)}
                  </h1>

                  <p>
                    ${escapeHtml(best.rarity)}
                  </p>

                  <div class="income">
                    💰 ${formatNumber(best.income)}/s
                  </div>

                </div>
              `
              :
              `
                <div class="best-pet">
                  Belum ada pet terdeteksi
                </div>
              `
            }

          </div>


          <div class="panel">

            <h2>🐾 DETAIL PET EQUIP</h2>

            ${
              pets.map((pet, index) => `

                <div class="pet">

                  <b>${index + 1}</b>

                  <div>
                    <div class="pet-name">
                      ${escapeHtml(pet.name)}
                    </div>

                    <div class="rarity">
                      ${escapeHtml(pet.rarity)}
                    </div>
                  </div>

                  <div class="pet-income">
                    ${formatNumber(pet.income)}/s
                  </div>

                </div>

              `).join("")
            }

          </div>

        </div>

      </div>

    `;

  }).join("");
}


function escapeHtml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


async function loadDashboard() {

  try {

    const response =
      await fetch("/api/players");

    const data =
      await response.json();

    render(data.players || []);

  } catch (error) {

    dashboard.innerHTML = `
      <div class="panel">
        ❌ Gagal mengambil data dashboard.
      </div>
    `;

  }

}


loadDashboard();

setInterval(loadDashboard, 3000);
