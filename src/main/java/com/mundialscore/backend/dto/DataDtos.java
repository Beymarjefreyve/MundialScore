package com.mundialscore.backend.dto;

import java.time.LocalDateTime;

public class DataDtos {

    public static class PartidoRequest {
        private String equipoLocal;
        private String equipoVisitante;
        private LocalDateTime fechaHora;
        private String estadio;

        public PartidoRequest() {
        }

        public PartidoRequest(String equipoLocal, String equipoVisitante, LocalDateTime fechaHora, String estadio) {
            this.equipoLocal = equipoLocal;
            this.equipoVisitante = equipoVisitante;
            this.fechaHora = fechaHora;
            this.estadio = estadio;
        }

        public String getEquipoLocal() {
            return equipoLocal;
        }

        public void setEquipoLocal(String equipoLocal) {
            this.equipoLocal = equipoLocal;
        }

        public String getEquipoVisitante() {
            return equipoVisitante;
        }

        public void setEquipoVisitante(String equipoVisitante) {
            this.equipoVisitante = equipoVisitante;
        }

        public LocalDateTime getFechaHora() {
            return fechaHora;
        }

        public void setFechaHora(LocalDateTime fechaHora) {
            this.fechaHora = fechaHora;
        }

        public String getEstadio() {
            return estadio;
        }

        public void setEstadio(String estadio) {
            this.estadio = estadio;
        }
    }

    public static class ResultadoRequest {
        private Integer golesLocal;
        private Integer golesVisitante;

        public ResultadoRequest() {
        }

        public ResultadoRequest(Integer golesLocal, Integer golesVisitante) {
            this.golesLocal = golesLocal;
            this.golesVisitante = golesVisitante;
        }

        public Integer getGolesLocal() {
            return golesLocal;
        }

        public void setGolesLocal(Integer golesLocal) {
            this.golesLocal = golesLocal;
        }

        public Integer getGolesVisitante() {
            return golesVisitante;
        }

        public void setGolesVisitante(Integer golesVisitante) {
            this.golesVisitante = golesVisitante;
        }
    }

    public static class PronosticoRequest {
        private Long partidoId;
        private Integer golesLocal;
        private Integer golesVisitante;

        public PronosticoRequest() {
        }

        public PronosticoRequest(Long partidoId, Integer golesLocal, Integer golesVisitante) {
            this.partidoId = partidoId;
            this.golesLocal = golesLocal;
            this.golesVisitante = golesVisitante;
        }

        public Long getPartidoId() {
            return partidoId;
        }

        public void setPartidoId(Long partidoId) {
            this.partidoId = partidoId;
        }

        public Integer getGolesLocal() {
            return golesLocal;
        }

        public void setGolesLocal(Integer golesLocal) {
            this.golesLocal = golesLocal;
        }

        public Integer getGolesVisitante() {
            return golesVisitante;
        }

        public void setGolesVisitante(Integer golesVisitante) {
            this.golesVisitante = golesVisitante;
        }
    }
}
