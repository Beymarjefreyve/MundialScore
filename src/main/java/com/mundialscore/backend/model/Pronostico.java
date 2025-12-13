package com.mundialscore.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "pronosticos", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "usuario_id", "partido_id" })
})
public class Pronostico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "partido_id", nullable = false)
    private Partido partido;

    private Integer golesLocalPronosticados;
    private Integer golesVisitantePronosticados;

    @Column(nullable = true)
    private Integer puntosObtenidos;

    public Pronostico() {
    }

    public Pronostico(Long id, Usuario usuario, Partido partido, Integer golesLocalPronosticados,
            Integer golesVisitantePronosticados, Integer puntosObtenidos) {
        this.id = id;
        this.usuario = usuario;
        this.partido = partido;
        this.golesLocalPronosticados = golesLocalPronosticados;
        this.golesVisitantePronosticados = golesVisitantePronosticados;
        this.puntosObtenidos = puntosObtenidos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Partido getPartido() {
        return partido;
    }

    public void setPartido(Partido partido) {
        this.partido = partido;
    }

    public Integer getGolesLocalPronosticados() {
        return golesLocalPronosticados;
    }

    public void setGolesLocalPronosticados(Integer golesLocalPronosticados) {
        this.golesLocalPronosticados = golesLocalPronosticados;
    }

    public Integer getGolesVisitantePronosticados() {
        return golesVisitantePronosticados;
    }

    public void setGolesVisitantePronosticados(Integer golesVisitantePronosticados) {
        this.golesVisitantePronosticados = golesVisitantePronosticados;
    }

    public Integer getPuntosObtenidos() {
        return puntosObtenidos;
    }

    public void setPuntosObtenidos(Integer puntosObtenidos) {
        this.puntosObtenidos = puntosObtenidos;
    }
}
