<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('items', function (Blueprint $table) {
            $table->increments('items_id');
            $table->integer("request_number");
            $table->string("requestee");
            $table->string("request_qty");
            $table->unsignedInteger("i_deptId")->nullable();
            $table->unsignedInteger('stockId')->nullable();
            $table->unsignedInteger('i_userId')->nullable();
            $table->date('date_requested');
            $table->string('pre_remarks');
            $table->string('post_remarks');
            $table->foreign('i_deptId')->references('department_id')->on('departments');
            $table->foreign('stockId')->references('stock_id')->on('stocks');
            $table->foreign('i_userId')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('items');
    }
}
