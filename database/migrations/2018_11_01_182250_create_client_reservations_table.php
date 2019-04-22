<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClientReservationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('client_reservations', function (Blueprint $table) {
            $table->increments('client_reservation_id');
            $table->unsignedInteger('clientId')->nullable();
            $table->string('purpose');
            $table->unsignedInteger('departmentId')->nullable();
            $table->unsignedInteger('venueId')->nullable();
            $table->date('start_date');
            $table->date('end_date'); 
            $table->time('start_time');
            $table->time('end_time');
            $table->date('date_created');
            $table->unsignedInteger('statusId')->nullable();
            $table->foreign('clientId')->references('client_id')->on('clients');
            $table->foreign('departmentId')->references('department_id')->on('departments');
            $table->foreign('venueId')->references('venue_id')->on('venues');
            $table->foreign('statusId')->references('status_id')->on('statuses');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('client_reservations');
    }
}
