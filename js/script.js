var program = attendance
if(document.getElementById('house-starter') || document.getElementById('senate-starter')){
    program = congressMembers
}

if(document.getElementById('house-starter') || document.getElementById('house-loyalty') || document.getElementById('house-attendance')){
    var url = 'house'
    fetcheando(url, program)
} else {
    var url = 'senate'
    fetcheando(url, program)
}

const button = document.querySelector('.showBtn')
const collapse = document.querySelector('#collapseExample')
let textButton = false
button.addEventListener('click', () => {
    button.textContent = textButton ? 'Read more' : 'Read less'
    textButton = !textButton
    collapse.scrollIntoView({
        behavior: "smooth"
    })
})

function fetcheando(url, program){
fetch(`https://api.propublica.org/congress/v1/113/${url}/members.json`, {
    headers: {'X-API-Key': 'ELE4KFrdU0j9YjvgyduPWp4DcZhdoP6iCvyWhCyk'}
})
.then (respuesta => respuesta.json())
.then(data => {
  program(data)
})
}

function attendance(data){
var statistics = {}
statistics.totalMembers = data.results[0].members.length
var countR = 0
var countD = 0
var countI = 0
var votedWithPartyR = 0
var votedWithPartyD = 0
var votedWithPartyI = 0

for(var i=0; i<statistics.totalMembers;i++){
    if(data.results[0].members[i].party == "R"){
        countR++
        votedWithPartyR = votedWithPartyR + data.results[0].members[i].votes_with_party_pct
    } else if(data.results[0].members[i].party == "D"){
        countD++
        votedWithPartyD = votedWithPartyD + data.results[0].members[i].votes_with_party_pct
    } else if(data.results[0].members[i].party === "ID"){
        countI++
        votedWithPartyI = votedWithPartyI + data.results[0].members[i].votes_with_party_pct
    }   
  }

statistics.membsR = countR
statistics.membsD = countD
statistics.membsI = countI
statistics.votedWPartyPromR = parseFloat((votedWithPartyR / countR).toFixed(2))
statistics.votedWPartyPromD = parseFloat((votedWithPartyD / countD).toFixed(2))
countI !== 0 ? statistics.votedWPartyPromI = parseFloat((votedWithPartyI / countI).toFixed(2)) : statistics.votedWPartyPromI = parseFloat((0).toFixed(2))

var nMissVotes = data.results[0].members.sort((a,b) => b.missed_votes_pct-a.missed_votes_pct)
var cantMenorE = Math.ceil(statistics.totalMembers * 0.10)
var lastMissAttenE = nMissVotes.splice(0, cantMenorE)
statistics.lastAttenE = lastMissAttenE

var mMissVotes = data.results[0].members.sort((a,b) => a.missed_votes_pct-b.missed_votes_pct)
var cantMenorM = Math.ceil(statistics.totalMembers * 0.10)
var mostMissAttenE = mMissVotes.splice(0, cantMenorM)
statistics.mostAttenE = mostMissAttenE

if(document.getElementById('house-attendance') || document.getElementById('senate-attendance')){
function tablesBottom(label, property){
    for(var i=0; i<statistics[property].length;i++){
        const tableID = document.getElementById(label)
        const trow = document.createElement('tr')
        const dName = document.createElement('td')
        const dNMVotes = document.createElement('td')
        const dMissed = document.createElement('td')
        const dLink = document.createElement('a')
        const url = statistics[property][i].url

        dLink.innerHTML = `${statistics[property][i].first_name} ${statistics[property][i].middle_name || ""} ${statistics[property][i].last_name}`
        dNMVotes.innerHTML = statistics[property][i].missed_votes
        dMissed.innerHTML = statistics[property][i].missed_votes_pct.toFixed(2)
        
        dLink.setAttribute('href', url)
        dLink.setAttribute('target', 'blank')

        trow.append(dName, dNMVotes, dMissed)
        dName.appendChild(dLink)
        tableID.appendChild(trow)
    }
  }
    tablesBottom('tablaLeastE', 'lastAttenE')
    tablesBottom('tablaMostE', 'mostAttenE')
}

var leastVWParty = data.results[0].members.sort((a,b) => a.votes_with_party_pct-b.votes_with_party_pct)
var cantMenorL = Math.ceil(statistics.totalMembers * 0.10)
var leastLoyal = leastVWParty.splice(0, cantMenorL)
statistics.leastLoyalH = leastLoyal

var mostVWParty = data.results[0].members.sort((a,b) => b.votes_with_party_pct-a.votes_with_party_pct)
var cantMenorM = Math.ceil(statistics.totalMembers * 0.10)
var mostLoyal = mostVWParty.splice(0, cantMenorM)
statistics.mostLoyalM = mostLoyal

if(document.getElementById('house-loyalty') || document.getElementById('senate-loyalty')){
function tablesBottomL(label, property){
    for(var i=0; i<statistics[property].length;i++){
        const tableIDL = document.getElementById(label)
        const lrow = document.createElement('tr')
        const lName = document.createElement('td')
        const lVotes = document.createElement('td')
        const lVProm = document.createElement('td')
        const lLink = document.createElement('a')
        const lUrl = statistics[property][i].url

        lLink.innerHTML = `${statistics[property][i].first_name} ${statistics[property][i].middle_name || ""} ${statistics[property][i].last_name}`
        lVotes.innerHTML = statistics[property][i].total_votes
        lVProm.innerHTML = statistics[property][i].votes_with_party_pct.toFixed(2)

        lLink.setAttribute('href', lUrl)
        lLink.setAttribute('target', 'blank')

        lrow.append(lName, lVotes, lVProm)
        lName.appendChild(lLink)
        tableIDL.appendChild(lrow)
    }
}
tablesBottomL('tablaLeastL', 'leastLoyalH')
tablesBottomL('tablaMostL', 'mostLoyalM')
}
}

function tableGlance(label, party, prom){
    var glance = document.getElementById(label)
    var glanceParty = document.createElement('td')
    if(party){
    glanceParty.innerHTML = statistics[party]
    glance.appendChild(glanceParty)
    var glanceProm = document.createElement('td')
    glanceProm.innerHTML = statistics[prom]
    glance.appendChild(glanceProm)
    } else {
    glanceParty.innerHTML = statistics.totalMembers
    glance.appendChild(glanceParty)
    }
}

tableGlance('glanceR', 'membsR', 'votedWPartyPromR')
tableGlance('glanceD', 'membsD', 'votedWPartyPromD')
tableGlance('glanceI', 'membsI', 'votedWPartyPromI')
tableGlance('glanceT')
}


function congressMembers(data){
    var tabla = document.getElementById('tablaHouse')
    if(document.getElementById('senate-starter')){
        tabla = document.getElementById('tablaSenate')
    }
for(var i=0; i<data.results[0].members.length;i++){
    const trow = document.createElement('tr')
    const dName = document.createElement('td')
    const dParty = document.createElement('td')
    const dStates = document.createElement('td')
    const dSeniority = document.createElement('td')
    const dVotes = document.createElement('td')
    const dLink = document.createElement('a')
    const dUrl = data.results[0].members[i].url

    dLink.innerHTML = `${data.results[0].members[i].first_name} ${data.results[0].members[i].middle_name || ""} ${data.results[0].members[i].last_name}`
    dParty.innerHTML = data.results[0].members[i].party
    dStates.innerHTML = data.results[0].members[i].state
    dSeniority.innerHTML = data.results[0].members[i].seniority
    dVotes.innerHTML = data.results[0].members[i].votes_with_party_pct.toFixed(2)

    dLink.setAttribute('href', dUrl)
    dLink.setAttribute('target', 'blank')
    
    trow.append(dName, dParty, dStates, dSeniority, dVotes)
    dName.appendChild(dLink)
    tabla.appendChild(trow)
 }
}


