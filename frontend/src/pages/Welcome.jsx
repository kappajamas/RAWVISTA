export default function Welcome() {
  return (
    <div>
      <section>
        <h1 className="title">Bine ai venit!</h1>
        <p>Te rog autentifică-te sau creează un cont pentru a continua.</p>

        <section className="py-5 text-center container">
          <div className="row py-lg-5">
            <div className="col-lg-6 col-md-8 mx-auto ">
              <h2 className="fw-light ">
                Începe astăzi să faci parte din echipa noastră!
              </h2>
              <p className="lead text-body-secondary mt-5">
                Iți gestionăm inteligent resursele, pentru proiecte de succes.
              </p>
            </div>
          </div>
        </section>

        <div className="album py-5 bg-body-tertiary">
          <div className="container">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              <div className="col">
                <div className="card shadow-sm">
                  <img
                    src="../public/produse.png"
                    alt="Produs"
                    className="card-img-top"
                    width="100%"
                    height="225"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <p className="card-text">Administrare produse</p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card shadow-sm">
                  <img
                    src="../public/rapid.png"
                    alt="Produs"
                    className="card-img-top"
                    width="100%"
                    height="225"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="card-body">
                    {" "}
                    <p className="card-text">Tranzacții rapide</p>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <div className="col">
                {" "}
                <div className="card shadow-sm">
                  {" "}
                  <img
                    src="../public/grup.png"
                    alt="Produs"
                    className="card-img-top"
                    width="100%"
                    height="225"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="card-body">
                    {" "}
                    <p className="card-text">Gestionare utilizatori</p>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>

        <div />
      </section>
    </div>
  );
}
