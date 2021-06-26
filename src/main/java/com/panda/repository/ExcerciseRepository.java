package com.panda.repository;

import com.panda.domain.Excercise;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Excercise entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExcerciseRepository extends JpaRepository<Excercise, Long> {}
