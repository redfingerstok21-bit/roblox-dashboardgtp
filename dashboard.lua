--==================================================
-- ROBLOX DASHBOARD MONITOR
-- Untuk experience milik sendiri / yang kamu punya izin
--==================================================

local Players = game:GetService("Players")
local HttpService = game:GetService("HttpService")

local Player = Players.LocalPlayer

-- GANTI DENGAN URL VERCEL KAMU
local API_URL = "https://roblox-dashboardgtp.vercel.app/api/report"

-- GANTI DENGAN SECRET YANG SAMA DI VERCEL
local SECRET = "SAE_MONITOR_928374"


--==================================================
-- FORMAT ANGKA
--==================================================

local function getNumber(value)

    if typeof(value) == "number" then
        return value
    end

    if typeof(value) == "string" then

        value = value:gsub(",", "")

        local number = tonumber(value)

        if number then
            return number
        end

    end

    return 0
end


--==================================================
-- MENCARI VALUE
--==================================================

local function findValue(root, names)

    for _, name in ipairs(names) do

        local object = root:FindFirstChild(name, true)

        if object then

            if object:IsA("NumberValue")
                or object:IsA("IntValue") then

                return object.Value

            elseif object:IsA("StringValue") then

                return getNumber(object.Value)

            end

        end

    end

    return 0
end


--==================================================
-- MONEY
--==================================================

local function getMoney()

    local leaderstats =
        Player:FindFirstChild("leaderstats")

    if leaderstats then

        return findValue(
            leaderstats,
            {
                "Money",
                "Cash",
                "Coins",
                "Currency"
            }
        )

    end

    return findValue(
        Player,
        {
            "Money",
            "Cash",
            "Coins"
        }
    )
end


--==================================================
-- SPEED
--==================================================

local function getSpeed()

    local character =
        Player.Character

    if not character then
        return 0
    end

    local humanoid =
        character:FindFirstChildOfClass("Humanoid")

    if humanoid then
        return humanoid.WalkSpeed
    end

    return 0
end


--==================================================
-- PET
--==================================================

local function getPets()

    local pets = {}

    -- CONTOH:
    -- Sesuaikan dengan folder pet di game milikmu.

    local petFolder =
        Player:FindFirstChild("Pets")

    if not petFolder then
        return pets
    end


    for _, pet in ipairs(petFolder:GetChildren()) do

        local income =
            findValue(
                pet,
                {
                    "Income",
                    "IncomePerSecond",
                    "MoneyPerSecond",
                    "Value"
                }
            )

        local rarity = "Unknown"

        local rarityObject =
            pet:FindFirstChild("Rarity", true)

        if rarityObject then
            rarity = tostring(rarityObject.Value)
        end


        table.insert(
            pets,
            {
                name = pet.Name,
                rarity = rarity,
                income = income
            }
        )

    end


    return pets
end


--==================================================
-- HITUNG TOTAL INCOME
--==================================================

local function calculateIncome(pets)

    local total = 0

    for _, pet in ipairs(pets) do
        total += getNumber(pet.income)
    end

    return total
end


--==================================================
-- KIRIM DATA
--==================================================

local function sendData()

    local pets =
        getPets()

    local income =
        calculateIncome(pets)

    local data = {

        userId =
            tostring(Player.UserId),

        username =
            Player.Name,

        income =
            income,

        money =
            getMoney(),

        speed =
            getSpeed(),

        pets =
            pets
    }


    local body =
        HttpService:JSONEncode(data)


    local success, result =
        pcall(function()

            return HttpService:RequestAsync({

                Url = API_URL,

                Method = "POST",

                Headers = {

                    ["Content-Type"] =
                        "application/json",

                    ["x-dashboard-secret"] =
                        SECRET
                },

                Body = body

            })

        end)


    if success then

        print(
            "[Dashboard] Data terkirim:",
            result.StatusCode
        )

    else

        warn(
            "[Dashboard] Gagal:",
            result
        )

    end

end


--==================================================
-- UPDATE SETIAP 5 DETIK
--==================================================

while true do

    sendData()

    task.wait(5)

end
