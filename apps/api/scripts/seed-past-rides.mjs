import { createClient } from "@libsql/client";

const client = createClient({
  url: "libsql://concertride-alalaguna.aws-eu-west-1.turso.io",
  authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzY1ODY3NDQsImlkIjoiMDE5ZGE0ZDEtYWUwMS03ZTVkLTkyYzItNTk4NDViOGQ4ZDc4IiwicmlkIjoiNDAzZDM4MmMtZjlhOC00NjllLWE3OGYtMjQzY2QxYThiN2IwIn0.eSXRnQvwP6Q-fWKaJMgR8GWs7-xcJpZd9jcVyjpBAyV9qW5aaA2knF5AFrgdHax_jr2FYWJVZ3mRlMXJxRH7AA",
});

// Viajes completados en conciertos realmente pasados (1-25 abril 2026):
// c_sansan_2026    SanSan Festival   Benicassim  2026-04-03
// c_5e6d1873-6     Diego Torres      Valencia    2026-04-19
// c_36a2442d-3     RADAR SPOTIFY     Madrid      2026-04-20
// c_6c809e07-d     The New Roses     Madrid      2026-04-23
// c_e85b3ab1-8     RUFUS DU SOL      Barcelona   2026-04-24
// c_766f091c-6     El Ultimo de la Fila Fuengirola 2026-04-25

const rides = [
  ["r_p01","u_laura","c_sansan_2026","Madrid",40.4168,-3.7038,"Nuevos Ministerios, Madrid","2026-04-02T09:00:00+02:00",22,4,0,1,"2026-04-04T06:00:00+02:00","party","Festival 3 dias. Acampamos.","completed","2026-04-04T07:00:00Z","both","2026-04-02T08:00:00Z","2026-03-18T10:00:00Z"],
  ["r_p02","u_rafa","c_sansan_2026","Valencia",39.4699,-0.3763,"Estacion del Norte, Valencia","2026-04-03T13:00:00+02:00",8,3,0,1,"2026-04-04T05:30:00+02:00","party","Viaje corto. Bizum en el punto de salida.","completed","2026-04-04T06:30:00Z","both","2026-04-03T12:00:00Z","2026-03-20T09:00:00Z"],
  ["r_p03","u_elena","c_5e6d1873-6","Zaragoza",41.6488,-0.8891,"Plaza Espana, Zaragoza","2026-04-19T14:00:00+02:00",14,4,0,1,"2026-04-20T01:30:00+02:00","chill","Para 30 min a mitad de ruta.","completed","2026-04-20T02:30:00Z","both","2026-04-19T13:00:00Z","2026-04-10T09:00:00Z"],
  ["r_p04","u_alba","c_36a2442d-3","Madrid",40.4168,-3.7038,"Moncloa, Madrid","2026-04-20T16:30:00+02:00",5,3,0,1,"2026-04-21T01:00:00+02:00","mixed","Viaje corto dentro de Madrid.","completed","2026-04-21T01:30:00Z","both","2026-04-20T15:30:00Z","2026-04-15T14:00:00Z"],
  ["r_p05","u_jorge","c_6c809e07-d","Barcelona",41.3851,2.1734,"Sants Estacio, Barcelona","2026-04-23T08:00:00+02:00",28,3,0,0,null,"mixed","Solo ida. Buen ambiente.","completed","2026-04-23T15:30:00Z","driver",null,"2026-04-18T11:00:00Z"],
  ["r_p06","u_dani","c_e85b3ab1-8","Madrid",40.4168,-3.7038,"Plaza de Castilla, Madrid","2026-04-24T10:00:00+02:00",30,3,0,1,"2026-04-25T04:00:00+02:00","party","DJ set increible. Vuelta al amanecer.","completed","2026-04-25T05:00:00Z","both","2026-04-24T09:00:00Z","2026-04-20T10:00:00Z"],
  ["r_p07","u_carmen","c_766f091c-6","Granada",37.1773,-3.5986,"Gran Via, Granada","2026-04-25T16:00:00+02:00",10,4,0,1,"2026-04-26T01:30:00+02:00","chill","Salimos puntual. Nostalgia garantizada.","completed","2026-04-26T02:30:00Z","both","2026-04-25T15:00:00Z","2026-04-18T12:00:00Z"],
  ["r_p08","u_miguel","c_e85b3ab1-8","Valencia",39.4699,-0.3763,"Av. del Cid, Valencia","2026-04-24T14:00:00+02:00",16,3,0,0,null,"party",null,"completed","2026-04-24T17:30:00Z","driver",null,"2026-04-22T09:00:00Z"],
];

const requests = [
  // r_p01 SanSan Laura (4 plazas)
  ["rr_p01_1","r_p01","u_nadia",1,"confirmed","Me apunto!","large","bizum","2026-03-20T10:00:00Z"],
  ["rr_p01_2","r_p01","u_sergio",1,"confirmed",null,"large","cash","2026-03-21T09:00:00Z"],
  ["rr_p01_3","r_p01","u_toni",2,"confirmed","Somos dos, llevamos tienda.","extra","bizum","2026-03-22T14:00:00Z"],
  // r_p02 SanSan Rafa (3 plazas)
  ["rr_p02_1","r_p02","u_carmen",1,"confirmed","Genial desde Valencia.","small","bizum","2026-03-25T11:00:00Z"],
  ["rr_p02_2","r_p02","u_pablo",2,"confirmed","Somos dos.","backpack","bizum","2026-03-26T10:00:00Z"],
  // r_p03 Diego Torres Elena (4 plazas)
  ["rr_p03_1","r_p03","u_jorge",1,"confirmed","Perfecta la parada.","backpack","cash","2026-04-10T09:00:00Z"],
  ["rr_p03_2","r_p03","u_marcos",1,"confirmed",null,"small","cash_or_bizum","2026-04-11T08:00:00Z"],
  ["rr_p03_3","r_p03","u_luis",2,"confirmed","Somos dos, gracias.","backpack","bizum","2026-04-12T10:00:00Z"],
  // r_p04 RADAR Madrid Alba (3 plazas)
  ["rr_p04_1","r_p04","u_ana",1,"confirmed","Me apunto!","none","bizum","2026-04-15T14:00:00Z"],
  ["rr_p04_2","r_p04","u_irene",2,"confirmed","Somos dos.","small","cash_or_bizum","2026-04-16T10:00:00Z"],
  // r_p05 The New Roses Jorge (3 plazas)
  ["rr_p05_1","r_p05","u_sergio",1,"confirmed","Perfecto, Sants.","backpack","cash_or_bizum","2026-04-18T11:00:00Z"],
  ["rr_p05_2","r_p05","u_pablo",2,"confirmed",null,"backpack","cash","2026-04-19T08:00:00Z"],
  // r_p06 RUFUS Dani (3 plazas)
  ["rr_p06_1","r_p06","u_alba",1,"confirmed","Que ganas del RUFUS!","cabin","bizum","2026-04-20T10:00:00Z"],
  ["rr_p06_2","r_p06","u_elena",2,"confirmed","Somos dos, perfecta vuelta.","small","bizum","2026-04-21T09:00:00Z"],
  // r_p07 El Ultimo Carmen (4 plazas)
  ["rr_p07_1","r_p07","u_nadia",1,"confirmed","Nostalgica total!","none","bizum","2026-04-18T12:00:00Z"],
  ["rr_p07_2","r_p07","u_miguel",1,"confirmed",null,"small","cash","2026-04-19T10:00:00Z"],
  ["rr_p07_3","r_p07","u_toni",2,"confirmed","Somos dos fans.","backpack","bizum","2026-04-20T14:00:00Z"],
  // r_p08 RUFUS Miguel (3 plazas)
  ["rr_p08_1","r_p08","u_cris",1,"confirmed","Desde Valencia, genial.","small","bizum","2026-04-22T09:00:00Z"],
  ["rr_p08_2","r_p08","u_marcos",2,"confirmed",null,"backpack","cash","2026-04-22T14:00:00Z"],
];

const reviews = [
  ["rv_p01_1","r_p01","u_nadia","u_laura",5,"Laura perfecta para festivales. Muy organizada.","2026-04-05T10:00:00Z"],
  ["rv_p01_2","r_p01","u_sergio","u_laura",5,"Excelente. Repito seguro.","2026-04-05T11:00:00Z"],
  ["rv_p01_3","r_p01","u_laura","u_nadia",5,"Nadia ideal como pasajera.","2026-04-06T09:00:00Z"],
  ["rv_p01_4","r_p01","u_laura","u_sergio",4,"Sergio correcto.","2026-04-06T09:05:00Z"],
  ["rv_p02_1","r_p02","u_carmen","u_rafa",5,"Rafa siempre fiable. Puntualísimo.","2026-04-05T12:00:00Z"],
  ["rv_p02_2","r_p02","u_pablo","u_rafa",5,"Super comodo el coche. 10/10.","2026-04-05T13:00:00Z"],
  ["rv_p02_3","r_p02","u_rafa","u_carmen",5,"Carmen perfecta.","2026-04-06T08:00:00Z"],
  ["rv_p03_1","r_p03","u_jorge","u_elena",5,"Elena excelente. La parada fue un acierto.","2026-04-20T12:00:00Z"],
  ["rv_p03_2","r_p03","u_marcos","u_elena",4,"Bien el viaje.","2026-04-20T13:00:00Z"],
  ["rv_p03_3","r_p03","u_elena","u_jorge",5,"Jorge siempre puntual.","2026-04-21T08:00:00Z"],
  ["rv_p04_1","r_p04","u_ana","u_alba",5,"Alba genial, viaje rapido y buena musica.","2026-04-21T14:00:00Z"],
  ["rv_p04_2","r_p04","u_irene","u_alba",5,"Perfecta. Repito.","2026-04-21T15:00:00Z"],
  ["rv_p04_3","r_p04","u_alba","u_ana",5,"Ana genial.","2026-04-22T08:00:00Z"],
  ["rv_p05_1","r_p05","u_sergio","u_jorge",4,"Buen viaje aunque llegamos justos.","2026-04-24T10:00:00Z"],
  ["rv_p05_2","r_p05","u_jorge","u_sergio",4,"Sergio correcto.","2026-04-24T12:00:00Z"],
  ["rv_p06_1","r_p06","u_alba","u_dani",5,"Dani conduce genial, buenisimo el ambiente.","2026-04-26T10:00:00Z"],
  ["rv_p06_2","r_p06","u_elena","u_dani",5,"Perfecto. La vuelta al amanecer fue epica.","2026-04-26T11:00:00Z"],
  ["rv_p06_3","r_p06","u_dani","u_alba",5,"Alba genial.","2026-04-26T13:00:00Z"],
  ["rv_p07_1","r_p07","u_nadia","u_carmen",5,"Carmen perfecta. El concierto fue increible.","2026-04-26T10:00:00Z"],
  ["rv_p07_2","r_p07","u_miguel","u_carmen",5,"10/10, repito.","2026-04-26T11:00:00Z"],
  ["rv_p07_3","r_p07","u_carmen","u_nadia",5,"Nadia encantadora.","2026-04-26T13:00:00Z"],
  ["rv_p08_1","r_p08","u_cris","u_miguel",4,"Miguel buen conductor para ser nuevo.","2026-04-25T12:00:00Z"],
  ["rv_p08_2","r_p08","u_miguel","u_cris",5,"Cris perfecta pasajera.","2026-04-25T14:00:00Z"],
];

console.log("Insertando viajes pasados...");
for (const r of rides) {
  await client.execute({
    sql: `INSERT OR IGNORE INTO rides
      (id,driver_id,concert_id,origin_city,origin_lat,origin_lng,origin_address,
       departure_time,price_per_seat,seats_total,seats_left,round_trip,return_time,
       playlist_url,vibe,smoking_policy,max_luggage,notes,instant_booking,
       price_negotiable,accepted_payment,status,completed_at,completion_confirmed_by,
       reminded_at,payment_reminder_sent_at,created_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0,0,'cash_or_bizum',?,?,?,NULL,?,?)`,
    args: [r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],r[8],r[9],r[10],r[11],r[12],
           null,r[13],"no","backpack",r[14],r[15],r[16],r[17],r[18],r[19]],
  });
}
console.log(`  ${rides.length} viajes OK`);

console.log("Insertando ride requests...");
for (const rr of requests) {
  await client.execute({
    sql: `INSERT OR IGNORE INTO ride_requests (id,ride_id,passenger_id,seats,status,message,luggage,payment_method,created_at) VALUES (?,?,?,?,?,?,?,?,?)`,
    args: rr,
  });
}
console.log(`  ${requests.length} requests OK`);

console.log("Insertando reviews...");
for (const rv of reviews) {
  await client.execute({
    sql: `INSERT OR IGNORE INTO reviews (id,ride_id,reviewer_id,reviewee_id,rating,comment,created_at) VALUES (?,?,?,?,?,?,?)`,
    args: rv,
  });
}
console.log(`  ${reviews.length} reviews OK`);

// Verificar
const check = await client.execute(
  "SELECT r.id, r.status, r.departure_time, c.name FROM rides r JOIN concerts c ON r.concert_id=c.id WHERE r.id LIKE 'r_p%' ORDER BY r.departure_time"
);
console.log("\nViajes pasados en Turso:");
for (const row of check.rows) {
  console.log(" ", row[0], "|", row[1], "|", String(row[2]).slice(0,10), "|", String(row[3]).slice(0,35));
}

client.close();
console.log("\nDone!");
